import {create} from "zustand"
import { axiosIntance } from "../lib/axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BaseURL=import.meta.env.MODE === "development" ? "http://localhost:1000" : "/"

export const useAuthstore=create((set,get)=>({
    authUser:null,
    isCheckingAuth:true,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,
    checkAuth: async()=>{
        try {
            const res= await axiosIntance.get("/auth/check");
            console.log(res)
            set({authUser:res.data});
            get().connectSocket()
        } catch (error) {
            console.log("Error in check Auth!!!")
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signUp: async(data)=>{
        set({isSigningUp:true})
        try {
            console.log("Hello")
            const res=await axiosIntance.post("/auth/sign-up",data)  
            console.log(res);
            set({authUser:res.data})
            toast.success("Accounts created Successfully !!!")
            get().connectSocket()
        } catch (error) {
            console.log(error)
        } finally{
            set({isSigningUp:false})
        }
    },

    login: async(data)=>{
        set({isLoggingIn:true});
        try{
            const res=await axiosIntance.post("/auth/log-in",data)
            set({authUser:res.data})
            toast.success("Logged In Successfully")
            get().connectSocket()
        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isLoggingIn:false});
        }
    },

    updateProfile: async(data)=>{
        set({ isUpdatingProfile: true });
        try {
        const res = await axiosIntance.put("/auth/update-profile-pic", data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
        } catch (error) {
        toast.error(error.response.data.message);
        } finally {
        set({ isUpdatingProfile: false });
        }
    },

    connectSocket:()=>{
        const {authUser}=get()
        if(!authUser || get().socket?.connected)
            return ;
        const socket=io(BaseURL,{
            query:{
                userId:authUser._id
            }
        })
        socket.connect();
        set({socket})

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },

    disconnectSocket:()=>{
        if(get().socket?.connected)
            get().socket.disconnect()
    },

    logout: async()=>{
        try{
            await axiosIntance.post("/auth/log-out")
            set({authUser:null})
            toast.success("logOut Successfully !!!")
            get().disconnectSocket()
        }catch(error){
            console.log(error);
            toast.error("Hello")
        }
    },    
}))
