import express from "express"
import { LogIn, LogOut, signUp, updateProfilePic, checkAuth } from "../controllers/auth.controller.js";
import { authenticationCheck } from "../middleware/auth.middleware.js";

const router=express.Router();

router.post("/sign-up",signUp)

router.post("/log-in",LogIn)

router.post("/log-out",LogOut)

router.put("/update-profile-pic",authenticationCheck,updateProfilePic)

router.get("/check",authenticationCheck,checkAuth)

export default router