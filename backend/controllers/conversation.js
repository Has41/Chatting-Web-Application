import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"
import User from "../models/User.js"
import errorHandler from "../utils/errorHandler.js"

const getCurrentConversation = async (req, res, next) => {
  try {
    const convoId = req.params.convoId

    const conversation = await Conversation.findById(convoId)
      .populate({
        path: "groupOwner participants",
        select: "username displayName profilePicture bio",
        model: "User",
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "seenBy.user",
          select: "username displayName profilePicture bio",
          model: "User",
        },
      })
      .select("conversationType groupName groupInfo groupPicture lastMessage")

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found!" })
    }

    res.status(200).json({
      message: "Success!",
      conversation,
    })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const getConversationsOfUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean()

    const conversations = await Conversation.find({
      _id: { $in: user.conversations },
    })
      .populate({
        path: "participants",
        select: "username displayName profilePicture",
      })
      .populate({
        path: "lastMessage",
        select: "content createdAt media",
      })
      .lean()

    return res.status(200).json({ conversations })
  } catch (err) {
    return next(errorHandler(500, err))
  }
}

const getMessagesOfConversation = async (req, res, next) => {
  try {
    const { convoId } = req.params
    if (!convoId) {
      return res.status(400).json({ message: "Conversation ID is required." })
    }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 20
    const skip = (page - 1) * limit

    const conversation = await Conversation.findById(convoId).lean()

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." })
    }

    const messages = await Message.find({
      _id: { $in: conversation.messages },
    })
      .populate({
        path: "seenBy.user",
        select: "username displayName profilePicture",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return res.status(200).json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    next(error)
  }
}

const createGroupConversation = async (req, res, next) => {
  try {
    const { participants, groupName, groupPicture, groupInfo } = req.body
    const groupOwnerId = req.user.id
    const allParticipants = [...new Set([...participants, groupOwnerId])]

    const users = await User.find({ _id: { $in: allParticipants } }, { displayName: 1, username: 1 })

    if (allParticipants.length < 3) {
      return res.status(400).json({ message: "A group must have at least 3 members" })
    }

    if (users.length !== allParticipants.length) {
      return res.status(404).json({ message: "Some participants not found" })
    }

    const participantNames = users.map((user) => user.displayName || user.username)

    const defaultGroupName = participantNames.join(", ")
    const finalGroupName = groupName || defaultGroupName

    const newGroupConversation = await Conversation.create({
      groupName: finalGroupName,
      groupPicture,
      groupOwner: groupOwnerId,
      participants: participants,
      groupInfo,
      conversationType: "group",
    })

    await User.updateMany({ _id: { $in: allParticipants } }, { $addToSet: { conversations: newGroupConversation._id } })

    res.status(201).json(newGroupConversation)
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const updateGroupConversation = async (req, res, next) => {
  try {
    const convoId = req.params.convoId
    const { groupName, groupPicture, groupInfo } = req.body

    const updateFields = {}
    if (groupName) updateFields.groupName = groupName
    if (groupPicture) updateFields.groupPicture = groupPicture
    if (groupInfo) updateFields.groupInfo = groupInfo

    const updatedGroup = await Conversation.findOneAndUpdate(
      { _id: convoId, groupOwner: req.user.id },
      { $set: updateFields },
      { new: true }
    )

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found or unauthorized!" })
    }

    res.status(200).json({ message: "Group updated successfully!", group: updatedGroup })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const leaveGroupConversation = async (req, res, next) => {
  try {
    const convoId = req.params.convoId
    const userId = req.user.id

    const leaveConversation = await Conversation.findOneAndUpdate(
      {
        _id: convoId,
        groupOwner: { $ne: userId },
      },
      {
        $pull: { participants: userId },
      },
      {
        new: true,
      }
    )

    if (!leaveConversation) {
      return res.status(404).json({ message: "Group not found or unauthorized!" })
    }
    if (leaveConversation.groupOwner.toString() === userId.toString()) {
      return res.status(403).json({ message: "Make someone else the owner of the group!" })
    }

    res.status(200).json({ message: "Group left successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const removeGroupConversation = async (req, res, next) => {
  try {
    const convoId = req.params.convoId

    const removeGroupConversation = await Conversation.findOneAndDelete({
      _id: convoId,
      groupOwner: req.user.id,
    })

    if (!removeGroupConversation) {
      return res.status(404).json({ message: "Group not found or unauthorized!" })
    }

    res.status(200).json({ message: "Group deleted successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const addGroupParticipants = async (req, res, next) => {
  try {
    const convoId = req.params.convoId
    const { participants } = req.body

    const group = await Conversation.findById(convoId)

    const existingParticipantIds = new Set(group.participants.map((participantId) => participantId.toString()))

    const newParticipants = participants.filter((participantId) => !existingParticipantIds.has(participantId))

    if (newParticipants.length === 0) {
      return res.status(400).json({ message: "All participants are already in the group!" })
    }

    const updatedGroup = await Conversation.findOneAndUpdate(
      {
        _id: convoId,
        groupOwner: req.user.id,
      },
      {
        $addToSet: {
          participants: { $each: newParticipants },
        },
      },
      { new: true }
    )

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found or unauthorized!" })
    }

    res.status(200).json({ message: "Participants added successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const removeGroupParticipants = async (req, res, next) => {
  try {
    const convoId = req.params.convoId
    const { participants } = req.body

    const findGroup = await Conversation.findOneAndUpdate(
      {
        _id: convoId,
        groupOwner: req.user.id,
      },
      {
        $pull: {
          participants: { $in: participants },
        },
      },
      { new: true }
    )

    if (!findGroup) {
      return res.status(404).json({ message: "Group not found or unauthorized!" })
    }

    res.status(200).json({ message: "Participants removed successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const getGroupParticipants = async (req, res, next) => {
  try {
    const convoId = req.params.convoId
    const group = await Conversation.findById(convoId)
      .select("participants groupOwner")
      .populate("participants groupOwner", "username displayName profilePicture")

    if (!group) {
      return res.status(404).json({ message: "Group not found!" })
    }

    return res.status(200).json({
      message: "Group participants fetched successfully!",
      participants: group.participants,
      groupOwner: group.groupOwner,
    })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const changeGroupOwnership = async (req, res, next) => {
  try {
    const convoId = req.params.convoId
    const newOwnerId = req.params.newOwnerId
    const userId = req.user.id

    const group = await Conversation.findOne({
      _id: convoId,
      groupOwner: userId,
      participants: newOwnerId,
    })

    if (!group) {
      return res.status(404).json({ message: "Group not found or conditions not met!" })
    }

    const updatedGroup = await Conversation.findOneAndUpdate(
      {
        _id: convoId,
        groupOwner: userId,
        participants: newOwnerId,
      },
      {
        $set: {
          groupOwner: newOwnerId,
        },
      },
      { new: true, select: "groupOwner participants" }
    )

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found or conditions not met!" })
    }

    const updatedParticipants = updatedGroup.participants.map((participantId) =>
      participantId.toString() === newOwnerId.toString() ? userId : participantId
    )

    await Conversation.updateOne(
      { _id: convoId },
      {
        $set: {
          participants: updatedParticipants,
        },
      }
    )

    res.status(200).json({
      message: "Group ownership transferred successfully!",
      groupOwner: updatedGroup.groupOwner,
      participants: updatedParticipants,
    })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

export {
  getCurrentConversation,
  createGroupConversation,
  updateGroupConversation,
  leaveGroupConversation,
  addGroupParticipants,
  removeGroupParticipants,
  changeGroupOwnership,
  removeGroupConversation,
  getMessagesOfConversation,
  getConversationsOfUser,
  getGroupParticipants,
}
