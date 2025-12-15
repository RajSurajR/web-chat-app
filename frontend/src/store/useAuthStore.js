import{create} from "zustand"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE ==="develpment"? "http://localhost:5001": "/";

export const useAuthStore = create((set, get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true, // first time check auth do
    onlineUsers : [],
    socket:null,

    checkAuth: async()=>{
        try{
            // set({authUser:{_id:123, fullName:"temp", email:"temp@gmail.com", pic:""}}); // temporary login for development
            const res = await axiosInstance.get("/auth/check"); // if user are login or not
            set({authUser:res.data})

            get().connectSocket();
        }catch(error){
            console.log("Error in checkAuth : " , error.message);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async(data)=>{
        set({isSigningUp:true});
        try{
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser : res.data})

            toast.success("Account Created Successfully");

            get().connectSocket();
        }catch(error){
            toast.error(error.response.data.message);

        }finally{
            set({isSigningUp: false});
        }
    },

    login: async(data)=>{
        set({isLoggingIng:true});
        try{
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser:res.data});
            toast.success("Logged in successfully");

            get().connectSocket();
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIng:false})
        }
    },

    logout: async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");

            get().disconnectSocket();
        }catch(error){
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async(data) =>{
        set({isUpdatingProfile:true})
        console.log("start update frontend");
        try{
            const res = await axiosInstance.put("/auth/update-profile", data);

            set({authUser:res.data});
            toast.success("Profile Updated Successfully");
        }catch(error){
            console.log("error in update profile: ", error);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile:false});
        }
    },

    connectSocket : ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        });
        socket.connect();

        set({socket:socket});

        socket.on("getOnlineUsers", (userIds)=>{
            set({onlineUsers : userIds});
        })

       
    },

    disconnectSocket : () =>{
        if(get().socket?.connect) get().socket.disconnect();
    },

}));