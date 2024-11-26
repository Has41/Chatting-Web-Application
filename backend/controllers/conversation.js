import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"
import User from "../models/User.js"
import errorHandler from "../utils/errorHandler.js"

const getCurrentConversation = async (req, res, next) => {
  try {
    const convoId = req.params.convoId

    const conversation = await Conversation.findById(convoId).populate("participants", "username")

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found!" })
    }

    const messages = await Message.find({ conversation: convoId })
      .populate("sender", "username")
      .populate("recipient", "username")
      .populate("seenBy.user", "username")
      .sort({ createdAt: 1 })

    res.status(200).json({
      message: "Success!",
      conversation,
      messages,
    })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const createGroupConversation = async (req, res, next) => {
  try {
    const { participants, groupName, groupPicture } = req.body

    const users = await User.find({ _id: { $in: participants } }, { displayName: 1, username: 1 })

    if (users.length !== participants.length) {
      return res.status(404).json({ message: "Some participants not found" })
    }

    const participantNames = users.map((user) => user.displayName || user.username)

    const defaultGroupName = participantNames.join(", ")
    const finalGroupName = groupName || defaultGroupName

    const newGroupConversation = await Conversation.create({
      groupName: finalGroupName,
      groupPicture,
      groupOwner: req.user.id,
      participants: participants,
      conversationType: "group",
    })

    res.status(201).json(newGroupConversation)
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const updateGroupConversation = async (req, res, next) => {
  try {
    const convoId = req.params.convoId
    const { groupName, groupPicture } = req.body

    const updateFields = {}
    if (groupName) updateFields.groupName = groupName
    if (groupPicture) updateFields.groupPicture = groupPicture

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
}
