import express from "express"
import {
  addGroupParticipants,
  changeGroupOwnership,
  createGroupConversation,
  getCurrentConversation,
  leaveGroupConversation,
  removeGroupParticipants,
  updateGroupConversation,
} from "../controllers/conversation.js"
import {
  addParticipantValidator,
  changeGroupOwnershipValidator,
  createConversationValidator,
  editConversationValidator,
  removeParticipantValidator,
  validateConvoId,
} from "../validators/conversationValidators.js"
import { validationResult } from "express-validator"

const router = express.Router()

router.get(
  "/get-current-convo/:convoId",
  validateConvoId,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  getCurrentConversation
)

router.post(
  "/create-group",
  createConversationValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  createGroupConversation
)

router.put(
  "/edit-group-info/:convoId",
  editConversationValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  updateGroupConversation
)

router.patch(
  "/leave-group/:convoId",
  validateConvoId,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  leaveGroupConversation
)

router.post(
  "/add-participants/:convoId",
  addParticipantValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  addGroupParticipants
)

router.delete(
  "/remove-participants/:convoId",
  removeParticipantValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  removeGroupParticipants
)

router.patch(
  "/change-ownership/:convoId/:newOwnerId",
  changeGroupOwnershipValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  changeGroupOwnership
)

export default router
