import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useSearchStore = create((set, get) => ({
    usersSearchList : [],
    isSearchLoading:false,
    isSendLoading:false,
    searchController:null,
    
    serachUsers: async(searchQuery, pageNum) =>{
        if (!searchQuery || searchQuery.trim() === "") {
            set({ usersSearchList: [] });
            return;
        }
        const prevController = get().searchController;
        if(prevController){ // cancel previous request
            prevController.abort();
        }
        const controller = new AbortController();
        set({searchController:controller, isSearchLoading:true});
        try{

            const res = await axiosInstance.get(
                `/users/search?q=${searchQuery}&limit=10&page=${pageNum}`
                , {signal:controller.signal});

            set({usersSearchList:res.data.data})
        }catch(error){
            if (error.name === "CanceledError") return;
            console.log("Serach error", error);
            toast.error(error?.response?.data?.messages || "Search failed");
        }finally{
            set({isSearchLoading:false});
        }
    },
    sentRequest: async(userId) =>{
        if(get().isSendLoading) return;
        try{
            set({isSendLoading:true});
            const res = await axiosInstance.post("/friendship/request", {userId});
            toast.success(res.data.message);
            
            const updatedList = get().usersSearchList.map(user =>
            user._id === userId
                ? { ...user, relationshipStatus:"sent" }
                : user
            );

            set({ usersSearchList: updatedList });

        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isSendLoading:false});
        }
    },
}))