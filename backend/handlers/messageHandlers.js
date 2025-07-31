import { io } from "../socket.js"
import { cacheConvoData } from "../utils/cachedMessage.js"
import errorHandler from "../utils/errorHandler.js"
import userSocketMap from "../utils/socketMap.js"
import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"
import User from "../models/User.js"

const updateConversationAndUser = async (conversation, createdMessage, userIds) => {
  try {
    conversation.messages.push(createdMessage._id)
    await conversation.save()
    await User.updateMany({ _id: { $in: userIds } }, { $addToSet: { conversations: conversation._id } })
  } catch (err) {
    console.error("Error in updateConversationAndUser: ", err)
  }
}

const createdMessageData = ({ messageData, fileData }) => {
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
        publicId: fileData.publicId,
        mediaUrl: fileData.url,
        caption: fileData.caption || "",
        thumbnailUrl: fileData.thumbnailUrl || "",
      }
    } else {
      console.error("Error setting url!")
    }

    return messageDataToCreate
  } catch (err) {
    console.error(err)
    throw errorHandler(500, "Failed to create message data: " + err)
  }
}

const sendMessage = async ({ messageData, fileData }) => {
  try {
    console.log("Recieved file data: ", fileData)
    const { conversationType, conversationId, sender, recipient } = messageData
    const senderSocketId = userSocketMap.get(sender)
    const recipientSocketId = conversationType === "private" ? userSocketMap.get(recipient) : null
    const createdMessage = await Message.create(createdMessageData({ messageData, fileData }))

    let conversation

    if (!["private", "group"].includes(conversationType)) {
      console.error("Invalid conversation type")
      return
    }

    if (conversationType === "private") {
      // Step 1: Try to find an existing conversation.
      conversation = await Conversation.findOne({
        participants: { $all: [sender, recipient] },
        conversationType: "private",
      })

      if (conversation) {
        // Conversation exists: update the lastMessage field.
        conversation.lastMessage = createdMessage._id
        await conversation.save()
      } else {
        // Conversation doesn't exist: create a new one with participants.
        conversation = await Conversation.create({
          participants: [sender, recipient],
          conversationType: "private",
          lastMessage: createdMessage._id,
          // Include other fields as needed.
        })
      }

      // Now update the conversation and user data.
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

    if (conversationType === "private") {
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", createdMessage)
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", createdMessage)
      }
    } else if (conversationType === "group") {
      io.to(conversationId).emit("receive-group-messages", createdMessage, conversation._id)
    } else {
      console.error("Failed to send message!")
      return
    }
  } catch (err) {
    console.error(err)
    throw errorHandler(500, "Failed to send message" + err)
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

const markMessageAsSeen = async (conversationId, userId, conversationType, lastMessageId) => {
  try {
    const conversation = await cacheConvoData(conversationId, userId)

    if (!conversation || !conversation.lastMessage)
      throw errorHandler(404, "Failed to find conversation or last message")

    validateParticipant(conversation, userId, conversationType)

    const updatedMessage = await Message.findByIdAndUpdate(
      lastMessageId,
      {
        $addToSet: { seenBy: { user: userId, seenAt: new Date() } },
      },
      { new: true }
    )
    console.log("Updated message:", updatedMessage)
    if (!updatedMessage) {
      throw errorHandler(404, "Message not found for updating seenBy")
    }
  } catch (err) {
    console.error(err)
    throw errorHandler(500, `Failed to update last seen: ${err?.message}`)
  }
}

export { sendMessage, markMessageAsSeen }
