import { io } from "../socket.js"
import { cacheConvoData, cacheMessage } from "../utils/cachedMessage.js"
import errorHandler from "../utils/errorHandler.js"
import userSocketMap from "../utils/socketMap.js"
import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"
import User from "../models/User.js"

const updateConversationAndUser = async (conversation, createdMessage, userIds) => {
  try {
    conversation.messages.push(createdMessage._id)
    await conversation.save()
    await User.updateMany({ _id: { $in: userIds } }, { $push: { conversations: conversation._id } })
  } catch (err) {
    console.error("Error in updateConversationAndUser: ", err)
  }
}

const createdMessageData = (messageData, fileData) => {
  try {
    const { conversationType, conversationId, sender, recipient, content, messageType } = messageData

    const messageDataToCreate = {
      sender,
      recipient: conversationType === "group" ? null : recipient,
      messageType,
      conversationType,
      conversation: conversationType === "group" ? conversationId : null,
    }

    if (messageType === "text") {
      messageDataToCreate.content = content
    }

    if (fileData && messageType === "file") {
      messageDataToCreate.media = {
        publicId: fileData.filename,
        mediaUrl: fileData.path,
        meta: {
          fileType: fileData.fileType,
          fileSize: fileData.size,
        },
      }
    } else {
      console.error("Error setting url!")
    }

    return messageDataToCreate
  } catch (err) {
    console.error(err)
    throw errorHandler(500, `Failed to create message data: ${err?.message}`)
  }
}

const sendMessage = async (messageData, fileData) => {
  try {
    console.log("Recieved file data: ", fileData)
    const { conversationType, conversationId, sender, recipient } = messageData
    const senderSocketId = userSocketMap.get(sender)
    const recipientSocketId = conversationType === "private" ? userSocketMap.get(recipient) : null
    const createdMessage = await Message.create(createdMessageData(messageData, fileData))

    let conversation

    if (!["private", "group"].includes(conversationType)) {
      console.error("Invalid conversation type")
      return
    }

    if (conversationType === "private") {
      conversation = await Conversation.findOneAndUpdate(
        {
          participants: { $all: [sender, recipient] },
          conversationType: "private",
        },
        { $set: { lastMessage: createdMessage._id } },
        { new: true, upsert: true }
      )

      if (!conversation) throw errorHandler(404, "Conversation not found!")
      await updateConversationAndUser(conversation, createdMessage, [sender, recipient])
    } else if (conversationType === "group") {
      conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { $set: { lastMessage: createdMessage._id } },
        { new: true }
      )

      if (!conversation) throw errorHandler(404, "Conversation not found!")
      await updateConversationAndUser(conversation, createdMessage, conversation.participants)
    }

    await conversation.save()
    const cachedMessageData = await cacheMessage(createdMessage._id, conversation._id, conversationType)

    if (conversationType === "private") {
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", cachedMessageData)
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", cachedMessageData)
      }
    } else if (conversationType === "group") {
      io.to(conversationId).emit("receive-group-messages", cachedMessageData)
    } else {
      console.error("Failed to send message!")
      return
    }
  } catch (err) {
    console.error(err)
    throw errorHandler(500, `Failed to send message: ${err?.message}`)
  }
}

const validateParticipant = (conversation, userId, conversationType) => {
  try {
    const isParticipant = conversation.participants.some((participant) => participant.toString() === userId.toString())

    if (conversationType === "private" && !isParticipant)
      throw errorHandler(403, "User is not a participant in this private conversation.")

    if (conversationType === "group") {
      const isGroupOwner = conversation.groupOwner.toString() === userId.toString()

      if (!isParticipant && !isGroupOwner)
        throw errorHandler(403, "User is neither a participant nor the owner of this group conversation.")
    } else if (conversationType !== "private" && conversationType !== "group") {
      throw errorHandler(400, "Invalid conversation type")
    }
  } catch (err) {
    console.error(err)
    throw errorHandler(500, `Failed to validate participant: ${err?.message}`)
  }
}

const markMessageAsSeen = async (conversationId, userId, conversationType) => {
  try {
    const conversation = await cacheConvoData(conversationId, userId)

    if (!conversation || !conversation.lastMessage)
      throw errorHandler(404, "Failed to find conversation or last message")

    validateParticipant(conversation, userId, conversationType)

    await Message.findByIdAndUpdate(
      conversation.lastMessage,
      {
        $addToSet: { seenBy: { user: userId, seenAt: new Date() } },
      },
      { new: true }
    )
  } catch (err) {
    console.error(err)
    throw errorHandler(500, `Failed to update last seen: ${err?.message}`)
  }
}

export { sendMessage, markMessageAsSeen }
