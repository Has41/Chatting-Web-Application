import express from "express"
import { addReaction, editMessage } from "../controllers/message.js"
import { editMessageValidator, addReactionValidator } from "../validators/messageValidator.js"
import validateApiData from "../utils/apiValidator.js"

const router = express.Router()

router.post("/add-reaction/:messageId", addReactionValidator, validateApiData, addReaction)

router.patch("/edit-message/:messageId", editMessageValidator, validateApiData, editMessage)

export default router
