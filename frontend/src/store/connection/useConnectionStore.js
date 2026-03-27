import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../useAuthStore";

export const useConnectionStore = create((set, get) => ({
    startChat: async() => {
        try{
            console.log("hit");
        }catch(error){
            console.log(error);
        }
    }

}))