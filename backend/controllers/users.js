import User from "../models/User.js"
import errorHandler from "../utils/errorHandler.js"
import jwt from "jsonwebtoken"

const getUserInfo = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(errorHandler(404, "Unable to find user."))
    }

    const userData = await User.findById(req.user.id).select(
      "username email profilePicture displayName phoneNumber dateOfBirth gender location bio interests friendRequests friends"
    )

    if (!userData) {
      return res.status(404).json({ message: "User data not found!" })
    }

    return res.status(200).json(userData)
  } catch (err) {
    return next(err)
  }
}

const editUserInfo = async (req, res, next) => {
  try {
    const updateData = req.body

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    })

    if (!updatedUser) {
      return next(errorHandler(404, "User not found."))
    }

    return res.status(200).json({
      message: "User profile updated successfully.",
      user: updatedUser,
    })
  } catch (err) {
    return next(errorHandler(500, err))
  }
}

const deleteUserAcc = async (req, res, next) => {
  try {
    const deleteAccount = await User.findByIdAndDelete(req.user.id)

    if (deleteAccount) {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
    }

    res.status(200).json({ message: "User deleted successfully.", user: deleteAccount })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const addUserInterest = async (req, res, next) => {
  try {
    const { newInterest } = req.body

    const user = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        interests: { $ne: newInterest },
        "interests.4": { $exists: false },
      },
      { $push: { interests: newInterest } },
      { new: true }
    )

    if (!user) {
      return next(errorHandler(403, "Interest already exists or maximum number of interests reached."))
    }

    return res.status(201).json({ message: "Interest added successfully." })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const removeUserInterest = async (req, res, next) => {
  try {
    const { interestToRemove } = req.body

    if (!interestToRemove) {
      return next(errorHandler(400, "Interest cannot be empty or null."))
    }

    const user = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        interests: interestToRemove,
      },
      { $pull: { interests: interestToRemove } },
      { new: true }
    )

    if (!user) {
      return next(errorHandler(404, "Interest not found or user not found."))
    }

    return res.status(200).json({ message: "Interest removed successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const toggleDarkMode = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $bit: { darkMode: { $not: "$darkMode" } } },
      { new: true }
    )

    if (!user) {
      return next(errorHandler(404, "User not found."))
    }

    return res.status(200).json({ message: "Preference updated successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const sendFriendRequest = async (req, res, next) => {
  try {
    const senderId = req.user.id
    const recipientId = req.params.userId

    if (!senderId) {
      return res.status(404).json({ message: "User not logged In!" })
    }

    if (senderId === recipientId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself!" })
    }

    const recipient = await User.findOneAndUpdate(
      { _id: recipientId, "friendRequests.from": { $ne: senderId } },
      { $push: { friendRequests: { from: senderId } } },
      { new: true }
    )

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found or request already sent!" })
    }

    res.status(200).json({ message: "Friend request sent successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const respondFriendRequest = async (req, res, next) => {
  try {
    const senderId = req.params.userId
    const userId = req.user.id
    const { response } = req.body

    const verifyFriendRequest = await User.findOne({
      "friendRequests.from": senderId,
    })

    if (!verifyFriendRequest) {
      return res.status(404).json({ message: "Friend request not found!" })
    }

    const userData = await User.findById(userId) //current User
    const recipientData = await User.findById(senderId) //Other user

    if (!userData || !recipientData) {
      return res.status(404).json({ message: "User not found!" })
    }

    const specificRequestIndex = userData.friendRequests.findIndex(
      (result) => result.from.toString() === senderId.toString()
    )

    if (specificRequestIndex === -1) {
      return res.status(404).json({ message: "Request not found!" })
    }

    userData.friendRequests[specificRequestIndex].status = response

    if (response === "accepted") {
      userData.friends.push(senderId)
      recipientData.friends.push(userId)
      userData.friendRequests.splice(specificRequestIndex, 1)
      await userData.save()
      await recipientData.save()
    }

    userData.friendRequests.splice(specificRequestIndex, 1)
    await userData.save()

    return res.status(200).json({
      message: "Friend request updated successfully!",
      status: userData.status,
    })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const getFriendsAndRequests = async (req, res, next) => {
  try {
    const userData = await User.findById(req.user.id).select("friendRequests friends")
    return res.status(200).json(userData)
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const removeFriends = async (req, res, next) => {
  try {
    const friendId = req.params.userId
    const userId = req.user.id

    const currentuserData = await User.findById(userId)
    const friendData = await User.findById(friendId)

    const verifyFriend = currentuserData.friends.includes(friendId)

    if (!verifyFriend) {
      return res.status(404).json({ message: "Friend not found!" })
    }

    //* Remove the friend from the current user's friend list
    const specificUserFriendIndex = currentuserData.friends.findIndex(
      (result) => result._id.toString() === friendId.toString()
    )
    currentuserData.friends.splice(specificUserFriendIndex, 1)

    //* Remove the current user from the friend's friend list
    const specificFriendIndex = friendData.friends.findIndex((result) => result._id.toString() === userId.toString())
    friendData.friends.splice(specificFriendIndex, 1)

    await currentuserData.save()
    await friendData.save()

    return res.status(200).json({ message: "Friend removed successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const searchUsersAndContent = async (req, res, next) => {
  try {
    const searchInfo = req.params.searchInfo
    const currentUserId = req.user.id

    const searchedUsers = await User.find({
      $or: [
        { username: { $regex: searchInfo, $options: "i" } },
        { displayName: { $regex: searchInfo, $options: "i" } },
      ],
      _id: { $ne: currentUserId },
    }).select("username")

    // TODO: Gonna search for messages too!
    // const findMessages = await Message.find({ content: { $regex: searchInfo, $options: 'i' } })

    // if (searchedUsers.length === 0 && findMessages.length === 0) {
    //     return res.status(404).json({ message: "No results found!" })
    // }

    if (searchedUsers.length === 0) {
      return res.status(404).json({ message: "No results found!" })
    }

    return res.status(200).json({ message: "Search results found!", users: searchedUsers })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

export {
  getUserInfo,
  editUserInfo,
  deleteUserAcc,
  addUserInterest,
  removeUserInterest,
  toggleDarkMode,
  sendFriendRequest,
  respondFriendRequest,
  getFriendsAndRequests,
  removeFriends,
  searchUsersAndContent,
}
