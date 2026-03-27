import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useSentReqStore = create((set, get) => ({
    sentList:[],
    isSentListLoading:false,
    isCancelLoading:false,
    
    // current User sent other user list
    getSentList:async() =>{
        try{
            set({isSentListLoading:true});
            const res = await axiosInstance.get("/friendship?type=sent");
            const sentDetails = res.data.data.map((item) => {
                return {
                    _id: item._id,                      
                    fullName: item.recipient.fullName,      
                    ouId:item.recipient._id,
                    email: item.recipient.email,            
                    profilePic: item.recipient.profilePic,  
                    status: item.status,                
                    createdAt: item.createdAt         
                };
            })
            set({sentList:sentDetails})
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isSentListLoading:false});
        }
    },
    cancelRequest: async(friendshipId) =>{
        try{
            set({isCancelLoading:true});
            const res = await axiosInstance.patch(`/friendship/reject/${friendshipId}`);
            set((state) => ({ sentList: state.sentList.filter(item => item._id !== friendshipId)}));
            toast.success("Requeste removed");
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isCancelLoading:false});
        }
    },
}));
   