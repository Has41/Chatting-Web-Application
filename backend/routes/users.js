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

router.put(
  "/edit-info/:userId",
  deleteImage,
  uploadProfilePicture.single("profilePicture"),
  editInfoValidator,
  validateApiData,
  editUserInfo
)

router.delete("/delete-account/:userId", deleteImage, validateUserId, validateApiData, deleteUserAcc)

router.post("/add-interests/:userId", addInterestValidator, validateApiData, addUserInterest)

router.delete("/remove-interests/:userId/:interest", removeInterestValidator, validateApiData, removeUserInterest)

router.patch("/toggle-darkmode/:userId", validateUserId, validateApiData, toggleDarkMode)

router.post("/send-friend-request/:userId", validateUserId, validateApiData, sendFriendRequest)

router.post("/respond-friend-request/:userId", respondRequestValidator, validateApiData, respondFriendRequest)

router.get("/get-friend-requests", getFriendsAndRequests)

router.delete("/remove-friend/:userId", validateUserId, validateApiData, removeFriends)

router.get("/search-users-messages/:searchInfo", searchInfoValidator, validateApiData, searchUsersAndContent)

export default router
