import express from "express"
import { authenticationCheck } from "../middleware/auth.middleware.js"
import { getUsersForSideBar, getMessages ,sendMessage} from "../controllers/message.controller.js"

const router=express.Router()

router.get("/users",authenticationCheck,getUsersForSideBar)

router.get("/:id",authenticationCheck,getMessages)

router.post("/send/:id",authenticationCheck,sendMessage)

export default router