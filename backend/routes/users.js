import express from "express"
import {
  addUserInterest,
  deleteUserAcc,
  editUserInfo,
  getFriendsAndRequests,
  getUserInfo,
  removeFriends,
  removeUserInterest,
  respondFriendRequest,
  searchUsersAndContent,
  sendFriendRequest,
  toggleDarkMode,
} from "../controllers/users.js"
import { deleteImage, uploadProfilePicture } from "../middlewares/uploads.js"
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

router.patch(
  "/edit-info",
  // deleteImage,
  // uploadProfilePicture.single("profilePicture"),
  editInfoValidator,
  validateApiData,
  editUserInfo
)

router.delete("/delete-account", deleteImage, validateUserId, validateApiData, deleteUserAcc)

router.post("/add-interests", addInterestValidator, validateApiData, addUserInterest)

router.delete("/remove-interests", removeInterestValidator, validateApiData, removeUserInterest)

router.patch("/toggle-darkmode", validateUserId, validateApiData, toggleDarkMode)

router.post("/send-friend-request", validateUserId, validateApiData, sendFriendRequest)

router.post("/respond-friend-request", respondRequestValidator, validateApiData, respondFriendRequest)

router.get("/get-friend-requests", getFriendsAndRequests)

router.delete("/remove-friend", validateUserId, validateApiData, removeFriends)

router.get("/search-users-messages/:searchInfo", searchInfoValidator, validateApiData, searchUsersAndContent)

export default router
