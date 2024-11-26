import { Server } from "socket.io"
import Conversation from "./models/Conversation.js"
import Message from "./models/Message.js"
import errorHandler from "./utils/errorHandler.js"
import redis from "./redis.js"

const userSocketMap = new Map()

const setupSocket = (server) => {
  let io = new Server(server, {
    cors: {
      origin: "*", // TODO: Change this for deployment
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  console.log("Socket.io server initialized!")

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`)
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId)
        break
      }
    }
  }

  const joinGroup = async (socket, conversationId, userId) => {
    try {
      const conversation = await Conversation.findById(conversationId).select("participants groupOwner")

      if (!conversation) {
        console.error(`Conversation with ID ${conversationId} not found!`)
        return
      }

      const groupOwnerId = conversation.groupOwner.toString()
      const isParticipant = conversation.participants.some((participant) => participant.toString() === userId)

      // Check if the user is either the group owner or a participant
      if (userId === groupOwnerId || isParticipant) {
        socket.join(conversationId)
        console.log(`User ${userId} joined group room: ${conversationId}`)
      } else {
        console.error(`User ${userId} is not authorized to join group room: ${conversationId}`)
      }
    } catch (err) {
      console.error(`Error in joinGroup for conversation ${conversationId} and user ${userId}:`, err)
    }
  }

  const cacheMessage = async (messageId, conversationId, conversationType) => {
    try {
      const messageCacheKey = `message:${messageId}`
      let cachedMessageData = await redis.get(messageCacheKey)

      if (cachedMessageData) {
        return JSON.parse(cachedMessageData)
      } else {
        let messageData

        if (conversationType === "private") {
          messageData = await Message.findById(messageId)
            .populate({
              path: "sender recipient",
              select: "id username displayName profilePicture",
            })
            .exec()
        } else if (conversationType === "group") {
          messageData = await Message.findById(messageId)
            .populate("sender", "id email username displayName profilePicture")
            .exec()
        } else {
          throw errorHandler(400, "Invalid conversation type")
        }

        if (!messageData) throw errorHandler(404, "Message not found!")

        cachedMessageData = messageData.toJSON()
        cachedMessageData.conversation = conversationId
        await redis.set(messageCacheKey, JSON.stringify(cachedMessageData), { ex: 3600 })

        return cachedMessageData
      }
    } catch (err) {
      console.error(err)
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

  io.on("connection", (socket) => {
    console.log("Client connected!")
    const userId = socket.handshake.query.userId

    if (userId) {
      userSocketMap.set(userId, socket.id)
    } else {
      socket.disconnect(true)
      return
    }

    //* Event Handlers
    socket.on("sendMessage", async (messageData, fileData) => {
      await sendMessage(messageData, fileData)
    })

    socket.on("markMessageAsSeen", async (conversationId, userId, conversationType) => {
      await markMessageAsSeen(conversationId, userId, conversationType)
    })

    socket.on("join-group", async (conversationId, userId) => {
      console.log(`Received join-group event for conversation ${conversationId} and user ${userId}`)
      await joinGroup(socket, conversationId, userId)
    })

    socket.on("disconnect", () => disconnect(socket))
  })
}

export default setupSocket
