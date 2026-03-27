import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../useAuthStore";
import { useChatStore } from "../useChatStore";


export const useFriendStore = create((set, get) => ({

    friendsList:[],
    isFriendsLoading:false,
    isDeleteLoading:false,
    startChatLoading:false,
    
    getFriendsList: async() =>{
        const myId = useAuthStore.getState().authUser?._id;
        if (!myId) {
            toast.error("Something is wrong please reload.")
            return;
        }
        set({isFriendsLoading:true});
        try{
            const res = await axiosInstance.get("/friendship?type=friends");
             const allFriend = res.data.data.map((item) => {
                const otherUser = item.requester._id.toString() === myId.toString() ? item.recipient : item.requester;
                return {
                    _id: item._id, 
                    ouId: otherUser._id,     
                    fullName: otherUser.fullName,
                    email: otherUser.email,
                    profilePic: otherUser.profilePic,
                    status: item.status,
                    blockedBy: item.blockedBy, 
                    createdAt: item.createdAt
                };
            });
            set({friendsList:allFriend})
        }catch(error){
            console.log("get user ", error);
            toast.error(error?.response?.data?.messages);
        }finally{
            set({isFriendsLoading:false});
        }
    },
    deleteFriend: async(friendshipId) =>{
        set({isDeleteLoading:true});
        try{
             const res = await axiosInstance.patch(`/friendship/cancel/${friendshipId}`);
            set((state) => ({
                 friendsList: state.friendsList.filter(
                    item => item._id !== friendshipId
            )}));
            toast.success(res.data.message);
        }catch(error){
            toast.error(error?.response?.data?.messages);
        }finally{
            set({isDeleteLoading:false});
        }
    },

    startChat: async(ouId, naviagte) =>{
        if(!ouId){
            console.log("not defind user id");
            return;
        }
        set({startChatLoading:true})
        try{
            const res = await axiosInstance.post("/conversation/dm", {otherUserId:ouId})
            // redirect to chatsection
            const convId = res.data.data._id;
            useChatStore.getState().setSelectedConv(convId);
            naviagte();
        }catch(error){
            console.log(error);
            toast.error(error.response.data.message);
        }finally{
            set({startChatLoading:false})
        }
    }
    

}));