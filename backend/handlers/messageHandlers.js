import { io } from "../socket.js"
import cacheMessage from "../utils/cachedMessage.js"
import errorHandler from "../utils/errorHandler.js"
import userSocketMap from "../utils/socketMap.js"
import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"

const sendMessage = async (messageData, fileData) => {
  try {
    console.log("Recieved file data: ", fileData)
    const { conversationType, conversationId, sender, recipient, content, messageType } = messageData
    const senderSocketId = userSocketMap.get(sender)
    const recipientSocketId = conversationType === "private" ? userSocketMap.get(recipient) : null

    let createdMessage

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

    createdMessage = await Message.create(messageDataToCreate)

    let conversation

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
      createdMessage.conversation = conversation._id
      await createdMessage.save()
    } else if (conversationType === "group") {
      conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { $set: { lastMessage: createdMessage._id } },
        { new: true }
      )

      if (!conversation) throw errorHandler(404, "Conversation not found!")
    } else {
      console.error("Invalid conversation type")
      return
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
    console.error(err.message)
    throw errorHandler(500, err.message)
  }
}

const markMessageAsSeen = async (conversationId, userId, conversationType) => {
  try {
    const conversation = await Conversation.findById(conversationId).select("lastMessage participants groupOwner")

    if (!conversation || !conversation.lastMessage) {
      throw errorHandler(404, "Failed to find conversation or last message")
    }

    const message = await Message.findById(conversation.lastMessage)

    if (!message) throw errorHandler(404, "Failed to find the message")

    if (conversationType === "private") {
      const isParticipant = conversation.participants.some(
        (participant) => participant.toString() === userId.toString()
      )

      if (!isParticipant) {
        throw errorHandler(403, "Recipient is not a participant in this conversation")
      }

      const hasSeen = message.seenBy.some((seen) => seen.user.toString() === userId.toString())

      if (!hasSeen) {
        await Message.findByIdAndUpdate(
          conversation.lastMessage,
          {
            $addToSet: { seenBy: { user: userId, seenAt: new Date() } },
          },
          { new: true }
        )
      }
    } else if (conversationType === "group") {
      const groupOwnerId = conversation.groupOwner.toString()
      const isParticipant = conversation.participants.some(
        (participant) => participant.toString() === userId.toString()
      )

      if (!isParticipant && groupOwnerId !== userId.toString()) {
        throw errorHandler(404, "Participant or owner not found!")
      }

      const hasSeen = message.seenBy.some((seen) => seen.user.toString() === userId.toString())

      if (!hasSeen && message.sender.toString() !== userId.toString()) {
        await Message.findByIdAndUpdate(
          conversation.lastMessage,
          {
            $addToSet: { seenBy: { user: userId, seenAt: new Date() } },
          },
          { new: true }
        )
      }
    } else {
      console.error("Invalid conversation type!")
      return
    }
  } catch (err) {
    console.error(err)
    throw errorHandler(500, "Failed to update last seen")
  }
}

export { sendMessage, markMessageAsSeen }
