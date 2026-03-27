import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages : [],
    conversations:[],
    selectedConv:null,
    isConvLoading:false,
    isMessagesLoading:false,

    getConversations: async() =>{ // sidebar
        const currentUserId = useAuthStore.getState().authUser?._id.toString();
        if (!currentUserId) {
            toast.error("Something is wrong please reload.")
            return;
        }
        set({isConvLoading:true});
        try{
            const res = await axiosInstance.get("/conversation/dm");
            const formatted = res.data.data.map((conv) => {
                const otherUser = conv.participants.find( p => p._id.toString() !== currentUserId );

                return {
                    _id: conv._id,
                    isGroup: conv.isGroup,
                    name : conv.isGroup ? groupName : otherUser.fullName,
                    profilePic : conv.isGroup ? null : otherUser.profilePic,
                    ouId : conv.isGroup ? null : otherUser._id,
                    lastMessage: conv.lastMessage?.text || null,
                    lastMessageTime: conv.updatedAt,
                    unreadCount: conv?.unreadCount || 0,
                };
            });
            set({conversations:formatted})
        }catch(error){
            toast.error(error?.response?.data?.messages);
        }finally{
            set({isConvLoading:false});
        }
    }, 

    getMessages: async(convId) =>{
        set({isMessagesLoading:true});
        try{
            const res = await axiosInstance.get(`/messages/dm/${convId}`);
            set({messages:res.data.data});

        }catch(error){
            toast.error(error.response.data.messages);
        }finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage: async(messageData) =>{
        const {selectedConv, messages, conversations} = get();
        try{
            const res = await axiosInstance.post(`/messages/dm/${selectedConv._id}`, messageData);
            set((state) => ({
                messages: [...state.messages, res.data.data]
            }));
            get().updateSidebar(res.data.data);
        }catch(error){
            toast.error(error?.response?.data.message);
        }
    },
    updateSidebar:(message)=>{
        const {selectedConv, conversations} = get();
        // update conversation sidebar lastmessage
        const updatedConversations = conversations.map((conv)=>{
             if(conv._id !== message.conversationId) return conv;

            return {
                ...conv,
                lastMessage: message.text || null,
                unreadCount: selectedConv?._id === conv._id 
                        ? 0 : (conv.unreadCount || 0) + 1
            };
        });
        // reorder conversation to top
        const sorted = updatedConversations.sort((a, b) => {
            if(a._id === message.conversationId) return -1;
            if(b._id === message.conversationId) return 1;
            return 0;
        })

        set({conversations:sorted});
    },

    subscribeToMessage: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.on("newMessage", (newMessage) => {

            const { selectedConv} = get();
            // accept messages for active conversation and update list and update ui
            if(selectedConv?._id === newMessage.conversationId){
                set((state) => ({
                    messages: [...state.messages, newMessage]
                }));
            }
            get().updateSidebar(newMessage);
    
        });
    },
    
    unsubscribeFromMessage: ()=>{
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
    },

    setSelectedConv : (selectedConv) =>{ 
        set((state) =>({
            selectedConv,
            conversations: state.conversations.map(conv =>
                conv._id === selectedConv?._id ? { ...conv, unreadCount:0} : conv
            )
        }))
    },
}))