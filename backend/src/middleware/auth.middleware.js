import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const authenticationCheck=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt
        if(!token){
            return res.status(400).json({message:"No token Available !!!"})
        }

        const decoded=jwt.verify(token,process.env.jwt_secret_key);

        if(!decoded){
            return res.status(400).json({message:"Unauthorized Invalid Token !!!"})
        }

        const user=await User.findById(decoded.id).select("-password")

        if(!user){
            return res.status(404).json({message:"User Not Found !!!"})
        }

        req.user=user

        next();
    }
    catch(error){
        return res.send(501).json({message:"Internal Server Error !!!"})
    }

}