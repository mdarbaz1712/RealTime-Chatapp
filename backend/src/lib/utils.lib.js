import jwt from "jsonwebtoken"

const generateToken=async(id,res)=>{
    const token=jwt.sign({id},process.env.jwt_secret_key,{expiresIn:"7d"})
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV !== "development"
    })
    return token;    
}

export default generateToken