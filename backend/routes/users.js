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
  toggleSidebarLock,
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
import { validationResult } from "express-validator"

const router = express.Router()

router.get("/get-info", getUserInfo)

router.put(
  "/edit-info/:userId",
  deleteImage,
  uploadProfilePicture.single("profilePicture"),
  editInfoValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  editUserInfo
)

router.delete(
  "/delete-account/:userId",
  deleteImage,
  validateUserId,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  deleteUserAcc
)

router.post(
  "/add-interests/:userId",
  addInterestValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  addUserInterest
)

router.delete(
  "/remove-interests/:userId/:interest",
  removeInterestValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  removeUserInterest
)

router.patch(
  "/toggle-darkmode/:userId",
  validateUserId,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  toggleDarkMode
)

router.patch(
  "/toggle-sidebar/:userId",
  validateUserId,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  toggleSidebarLock
)

router.post(
  "/send-friend-request/:userId",
  validateUserId,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  sendFriendRequest
)

router.post(
  "/respond-friend-request/:userId",
  respondRequestValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  respondFriendRequest
)

router.get("/get-friend-requests", getFriendsAndRequests)

router.delete(
  "/remove-friend/:userId",
  validateUserId,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  removeFriends
)

router.get(
  "/search-users-messages/:searchInfo",
  searchInfoValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  searchUsersAndContent
)

export default router
