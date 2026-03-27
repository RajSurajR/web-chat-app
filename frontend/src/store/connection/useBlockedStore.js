import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../useAuthStore";

export const useBlockedStore = create((set, get) => ({
    blockedList:[],
    isBlockListLoading:false,
    isUnblockLoading:false,
    
    getBlockedList:async() =>{
        const myId = useAuthStore.getState().authUser?._id;
        if (!myId) {
            toast.error("Something is wrong please reload.")
            return;
        }
        set({isBlockListLoading:true});
        try{            
            const res = await axiosInstance.get("/friendship?type=blocked");

            const blockedUsers = res.data.data.map((item) => {
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
            set({blockedList:blockedUsers});
        }catch(error){
            toast.error(error.response?.data?.message);
        }finally{
            set({isBlockListLoading:false});
        }
    },

    unblockRequest: async(friendshipId) =>{
        set({isUnblockLoading:true});
        try{
            const res = await axiosInstance.patch(`/friendship/unblock/${friendshipId}`);
            set((state)=>(
                {blockedList:state.blockedList.filter(item => item._id != friendshipId)}
            ));
            toast.success(res.data.message);
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isUnblockLoading:false});
        }
    },


}))