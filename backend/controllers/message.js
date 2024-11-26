import Message from "../models/Message.js"
import errorHandler from "../utils/errorHandler.js"

const addReaction = async (req, res, next) => {
  try {
    const { emoji } = req.body
    const { messageId } = req.params
    const userId = req.user.id

    const message = await Message.findById(messageId).select("reactions")

    if (!message) {
      return res.status(404).json({ message: "Message not found!" })
    }

    const existingReaction = message.reactions.find((reaction) => reaction.user.toString() === userId.toString())

    if (existingReaction) {
      existingReaction.emoji = emoji
    } else {
      message.reactions.push({ user: userId, emoji })
    }

    await message.save()

    return res.status(200).json({ message: "Reaction added successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const editMessage = async (req, res, next) => {
  try {
    const messageId = req.params.messageId
    const { content } = req.body

    const editedAt = new Date()

    const editMessage = await Message.findOneAndUpdate(
      { _id: messageId },
      { $set: { content, editedAt } },
      { new: true }
    )

    if (!editMessage) {
      return res.status(404).json({ message: "Message not found" })
    }

    return res.status(200).json({ message: "Message edited successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

export { addReaction, editMessage }
