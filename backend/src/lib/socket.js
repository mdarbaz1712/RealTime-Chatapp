import http from "http"
import express from "express"
import {Server} from "socket.io"

const app =express()
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    },
})

//Used to store online users
const userSocketMap={} //{userId:socketId}

export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

io.on("connection",(socket)=>{
    console.log("A User Connnected ",socket.id)

    const userId=socket.handshake.query.userId

    if(userId){
        userSocketMap[userId]=socket.id
    }
    
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        console.log("A User is disconnected ",socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

export {io,app,server}