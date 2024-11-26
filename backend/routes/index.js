import express from "express"
import authRoutes from "./auth.js"
import userRoutes from "./users.js"
import messageRoutes from "./message.js"
import convoRoutes from "./conversation.js"
import fileRoute from "./files.js"
import isAuthentic from "../middlewares/checkAuth.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/users", isAuthentic, userRoutes)
router.use("/messages", messageRoutes)
router.use("/conversations", convoRoutes)
router.use("/files", fileRoute)

export default router
