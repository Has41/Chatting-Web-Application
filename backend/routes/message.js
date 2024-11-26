import express from "express"
import { addReaction, editMessage } from "../controllers/message.js"
import { editMessageValidator, addReactionValidator } from "../validators/messageValidator.js"
import { validationResult } from "express-validator"

const router = express.Router()

router.post(
  "/add-reaction/:messageId",
  addReactionValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  addReaction
)

router.patch(
  "/edit-message/:messageId",
  editMessageValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  editMessage
)

router.post("/upload-file")

export default router
