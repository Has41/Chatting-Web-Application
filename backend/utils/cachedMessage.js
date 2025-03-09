import redis from "../redis.js"
import Message from "../models/Message.js"
import Conversation from "../models/Conversation.js"
import errorHandler from "./errorHandler.js"

const validateConvoType = async (messageId, conversationType) => {
  try {
    let messageData

    if (conversationType === "group") {
      messageData = await Message.findById(messageId)
        .populate("sender", "id username displayName profilePicture")
        .exec()
    } else if (conversationType === "private") {
      messageData = await Message.findById(messageId)
        .populate("sender recipient", "id username displayName profilePicture")
        .exec()
    } else {
      throw errorHandler(400, "Invalid conversation type")
    }

    if (!messageData) throw errorHandler(404, "Message not found!")

    return messageData
  } catch (err) {
    console.error(err)
    throw errorHandler(500, "Failed to validate convo: ", err)
  }
}

const cacheMessage = async (messageId, conversationId, conversationType) => {
  try {
    const messageCacheKey = `message:${messageId}`
    let cachedMessageData = await redis.get(messageCacheKey)

    if (cachedMessageData) {
      return JSON.parse(cachedMessageData)
    } else {
      const messageData = await validateConvoType(messageId, conversationType)
      cachedMessageData = messageData.toJSON()
      if (!cachedMessageData.conversation) {
        cachedMessageData.conversation = conversationId
      }
      await redis.set(messageCacheKey, JSON.stringify(cachedMessageData), { ex: 3600 })

      return cachedMessageData
    }
  } catch (err) {
    console.error(err)
    throw errorHandler(500, `Failed to cache message: ${err?.message}`)
  }
}

const validateUserParticipation = (conversation, userId) => {
  const isParticipant = conversation.participants.some((participant) => participant.toString() === userId.toString())

  if (!isParticipant) {
    const isGroupOwner = conversation.groupOwner?.toString() === userId.toString()
    if (!isGroupOwner) {
      throw errorHandler(403, "User is neither a participant nor the owner of this conversation.")
    }
  }
}

const cacheConvoData = async (conversationId, userId) => {
  try {
    const convoCacheKey = `conversation:${conversationId}`
    let cachedConvoData = await redis.get(convoCacheKey)
    if (cachedConvoData) {
      if (typeof cachedConvoData === "string") {
        return JSON.parse(cachedConvoData)
      }
      return cachedConvoData
    } else {
      const convoData = await Conversation.findById(conversationId).select("participants groupOwner lastMessage")

      if (!convoData) throw errorHandler(404, "Conversation not found")

      validateUserParticipation(convoData, userId)

      const convoDataToCache = convoData.toJSON()
      await redis.set(convoCacheKey, JSON.stringify(convoDataToCache), { ex: 3600 })

      return convoDataToCache
    }
  } catch (err) {
    console.error(err)
    throw errorHandler(500, `Failed to cache conversation: ${err?.message}`)
  }
}

export { cacheMessage, cacheConvoData }
