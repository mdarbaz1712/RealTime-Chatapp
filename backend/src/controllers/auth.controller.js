import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import generateToken from "../lib/utils.lib.js"
import cloudinary from "../lib/cloudinary.lib.js"

export const signUp= async(req,res)=>{
    try{
        const {fullName,email,password,profilePic}=req.body
        if(!fullName||!email||!password){
            return res.status(400).json({message:"All Fields are Required !!! "})
        }
        if(!password || password.length<6){
            return res.status(400).json({message:"Password have atleast 6 characters !!!"})
        }

        const extingUser=await User.findOne({email})

        if(extingUser){
            return res.status(400).json({message:"User Already exists !!!"})
        }

        const salt=await bcrypt.genSalt(10);

        const hashPassword=await bcrypt.hash(password,salt);

        const newUser= new User({fullName,email,password:hashPassword})
        
        if(!newUser){
            return res.status(400).json({message:"Internal Server Error !!!"});
        }

        generateToken(newUser._id,res);
        await newUser.save();

        return res.status(200).json({_id:newUser._id,fullName:newUser.fullName,email:newUser.email,profilePic:newUser.profilePic});        
    }
    catch(error){
        console.log(error);
        return res.status(400).json({message:"Internal Server Error !!!"})
    }
}

export const LogIn= async(req,res)=>{
    try {
        const {email,password}=req.body

        if(!email || !password){
            return res.status(400).json({message:"All Fields are required !!!"})
        }

        const extingUser=await User.findOne({email});

        if(!extingUser){
            return res.status(400).json({message:"User does not exist !!!"})
        }

        const isPasswordCorrect=await bcrypt.compare(password,extingUser.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Credentials !!!"})
        }

        generateToken(extingUser._id,res);

        return res.status(200).json({_id:extingUser._id,fullName:extingUser.fullName,email:extingUser.email,password:extingUser.password
    })
    } catch (error) {
        return res.status(400).json({message:"Internal Server Error !!!"})
    }    
}

export const LogOut=async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logout Successfully !!!"})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error !!!"})
    }
}

export const updateProfilePic=async(req,res)=>{
    try{
        const userId=req.user._id
        const {profilePic}=req.body
        if(!profilePic){
            return res.status(400).json({message:"Profile photo is required !!!"})
        }
        const cloudinaryResponse=await cloudinary.uploader.upload(profilePic)

        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:cloudinaryResponse.secure_url},{new:true})
        res.status(200).json(updatedUser)
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error !!!"})
    }
}

export const checkAuth= (req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(500).json({message:"Internal Server Error !!!"})
    }
}