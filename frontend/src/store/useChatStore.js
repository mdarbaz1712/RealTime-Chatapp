import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosIntance } from "../lib/axios.js"
import { useAuthstore } from "./authStore.js"

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUsersLoading:true})
        try {
            const res=await axiosIntance.get("/message/users")
            set({users:res.data});
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUsersLoading:false});
        }
    },

    getMessages:async(id)=>{
        set({isMessagesLoading:true})
        try {
            const res=await axiosIntance.get(`/message/msg/${id}`)
            set({messages:res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isMessagesLoading:false})
        }
    }, 

    sendMessage:async(messageData)=>{
        const {selectedUser,messages}=get()
        try {
            const res=await axiosIntance.post(`/message/send/${selectedUser._id}`,messageData)
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages:()=>{
        const {selectedUser}=get()
        if(!selectedUser)
            return ;
        const socket=useAuthstore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId !== selectedUser._id)
                return ;
            set({
                messages:[...get().messages,newMessage]
            })
        })
    },

    unsubscribeFromMessages:()=>{
        const socket=useAuthstore.getState().socket
        socket.off("newMessage")
    },

    setSelectedUser:(selectedUser)=>{
        set({selectedUser})
    }
}))