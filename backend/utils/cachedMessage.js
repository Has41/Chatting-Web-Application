import redis from "../redis.js"

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

export default cacheMessage
