import { create } from "zustand"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: false, // first time check auth do
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        if(get().isCheckingAuth) return;
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/me"); // if user are login or not
            // console.log("Auth : ", res.data);
            set({ authUser: res.data.data })
            // get().connectSocket();
        } catch (error) {
            // console.log("Error in checkAuth : ", error?.message);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                toast.error(error.response.data.message);
            }
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // signup: async(data)=>{
    //     set({isSigningUp:true});
    //     try{
    //         const res = await axiosInstance.post("/auth/signup", data);
    //         set({authUser : res.data})
    //         toast.success("Account Created Successfully");
    //         get().connectSocket();
    //     }catch(error){
    //         toast.error(error.response.data.message);
    //     }finally{
    //         set({isSigningUp: false});
    //     }
    // },
    // login: async(data)=>{
    //     set({isLoggingIng:true});
    //     try{
    //         const res = await axiosInstance.post("/auth/login", data);
    //         set({authUser:res.data});
    //         toast.success("Logged in successfully");
    //         get().connectSocket();
    //     }catch(error){
    //         toast.error(error.response.data.message);
    //     }finally{
    //         set({isLoggingIng:false})
    //     }
    // },
    // updateProfile: async (data) => {
    //     set({ isUpdatingProfile: true })
    //     console.log("start update frontend");
    //     try {
    //         const res = await axiosInstance.put("/auth/update-profile", data);
    //         set({ authUser: res.data });
    //         toast.success("Profile Updated Successfully");
    //     } catch (error) {
    //         console.log("error in update profile: ", error);
    //         toast.error(error.response.data.message);
    //     } finally {
    //         set({ isUpdatingProfile: false });
    //     }
    // },

    logout: async ({signOut, navigate}) => {
        try {
            await signOut();
            set({ authUser: null });
            get().disconnectSocket();
            toast.success("Logged out successfully");
            navigate("/login")
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateUserImg: ({imageUrl}) =>{
        const data = get().authUser;
        data.profileImg = imageUrl;
        set({authUser:data});
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId:authUser._id,
            }
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connect) get().socket.disconnect();
    },

}));