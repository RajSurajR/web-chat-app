import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useReceivedReqStore = create((set, get) => ({
    requestList:[],
    isReqListLoading:false,
    isAcceptLoading:false,
    isBlockLoading:false,
    isRejectLoading:false,

    // other user sent request to current user
    getRequestList:async() =>{
        try{
            set({isReqListLoading:true});
            const res = await axiosInstance.get("/friendship?type=received");
            const requesterDetails = res.data.data.map((item) => {
                 return {
                    _id: item._id,                      
                    ouId: item.requester._id,
                    fullName: item.requester.fullName,      
                    email: item.requester.email,            
                    profilePic: item.requester.profilePic,  
                    status: item.status,                
                    createdAt: item.createdAt         
                };
            });
            set({requestList:requesterDetails})
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isReqListLoading:false});
        }
    },

    acceptRequest: async(friendshipId) =>{
        set({isAcceptLoading:true});
        try{
            const res = await axiosInstance.patch(`/friendship/accept/${friendshipId}`);
            set((state) => (
                {requestList: state.requestList.filter(item => item._id !== friendshipId) }
            ));
            toast.success(res.data.message);
            return true;
        }catch(error){
            toast.error(error.response.data.message);
            return false;
        }finally{
            set({isAcceptLoading:false});
        }
    },
    rejectRequest: async(friendshipId) =>{
        try{
            set({isRejectLoading:true});
            const res = await axiosInstance.patch(`/friendship/reject/${friendshipId}`);
            set((state) => ({ requestList: state.requestList.filter(item => item._id !== friendshipId)}));
            toast.success(res.data.message);
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isRejectLoading:false});
        }
    },
    blockRequest: async(friendshipId) =>{
        set({isBlockLoading:true});
        try{
            const res = await axiosInstance.patch(`/friendship/block/${friendshipId}`);
             set((state)=>(
                {requestList:state.requestList.filter(item => item._id != friendshipId)}
            ));
            toast.success(res.data.message);
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isBlockLoading:false});
        }
    },
}));