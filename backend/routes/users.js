import express from "express"
import {
  addUserInterest,
  deleteUserAcc,
  editUserInfo,
  getFriendsAndConversations,
  getFriendsAndRequests,
  getUserById,
  getUserInfo,
  removeFriends,
  removeUserInterest,
  respondFriendRequest,
  searchConversationUsersAndContent,
  searchUsersOrFriends,
  sendFriendRequest,
  toggleDarkMode,
} from "../controllers/users.js"
import { deleteImage } from "../middlewares/uploads.js"
import {
  addInterestValidator,
  editInfoValidator,
  removeInterestValidator,
  respondRequestValidator,
  searchInfoValidator,
  validateUserId,
} from "../validators/userValidators.js"
import validateApiData from "../utils/apiValidator.js"

const router = express.Router()

router.get("/get-info", getUserInfo)

router.get("/get-info/:userId", validateUserId, validateApiData, getUserById)

router.patch("/edit-info", editInfoValidator, validateApiData, editUserInfo)

router.delete("/delete-account", deleteImage, validateUserId, validateApiData, deleteUserAcc)

router.post("/add-interests", addInterestValidator, validateApiData, addUserInterest)

router.delete("/remove-interests", removeInterestValidator, validateApiData, removeUserInterest)

router.patch("/toggle-darkmode", validateUserId, validateApiData, toggleDarkMode)

router.post("/send-friend-request/:userId", validateUserId, validateApiData, sendFriendRequest)

router.post("/respond-friend-request/:userId", respondRequestValidator, validateApiData, respondFriendRequest)

router.get("/get-friends-and-requests", getFriendsAndRequests)

router.get("/get-friends-and-conversations", getFriendsAndConversations)

router.delete("/remove-friend", validateUserId, validateApiData, removeFriends)

router.get("/search-user-conversations-data", searchInfoValidator, validateApiData, searchConversationUsersAndContent)

router.get("/search-friends-users", searchInfoValidator, validateApiData, searchUsersOrFriends)

export default router
