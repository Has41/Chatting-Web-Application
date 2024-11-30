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
import validateApiData from "../utils/apiValidator.js"

const router = express.Router()

router.get("/get-current-convo/:convoId", validateConvoId, validateApiData, getCurrentConversation)

router.post("/create-group", createConversationValidator, validateApiData, createGroupConversation)

router.put("/edit-group-info/:convoId", editConversationValidator, validateApiData, updateGroupConversation)

router.patch("/leave-group/:convoId", validateConvoId, validateApiData, leaveGroupConversation)

router.post("/add-participants/:convoId", addParticipantValidator, validateApiData, addGroupParticipants)

router.delete("/remove-participants/:convoId", removeParticipantValidator, validateApiData, removeGroupParticipants)

router.patch(
  "/change-ownership/:convoId/:newOwnerId",
  changeGroupOwnershipValidator,
  validateApiData,
  changeGroupOwnership
)

export default router
