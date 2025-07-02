
import cloudinary from "../lib/cloudinary.lib.js"
import { getReceiverSocketId ,io} from "../lib/socket.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"


export const getUsersForSideBar=async(req,res)=>{
    try{
        const userId=req.user.id
        const allFriend=await User.find({_id:{ $ne: userId }}).select("-password")
        res.status(200).json(allFriend)
    }
    catch(error){
        res.status(400).json({message:"Internal Server Error !!!"})
    }
}

export const getMessages=async(req,res)=>{
    try {
        const friendId=req.params.id
        const myId=req.user._id
        
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:friendId},
                {senderId:friendId,receiverId:myId}
            ]
        })
        return res.status(200).json(messages)

    } catch (error) {
        res.status(400).json({message:"Internal Server Error !!!"})
    }
}

export const sendMessage=async(req,res)=>{
    try {
        const receiverId=req.params.id
        const senderId=req.user._id
        const {text,img}=req.body

        let imageUrl;

        if(img){
            const uploaderResponse=await cloudinary.uploader.upload(img)

            imageUrl=uploaderResponse.secure_url
        }
        
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            img:imageUrl
        })

        await newMessage.save();

        //Realtime Functionality Using socket.io
        const receiverSocketId=getReceiverSocketId(receiverId)

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }



        res.status(200).json(newMessage)

    } catch (error) {
        res.status(400).json({message:"Internal Server Error !!!"})
    }
}