import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Message, MessageDocument } from '../users/schemas/message.schema.js'
import { Conversation, ConversationDocument } from '../users/schemas/conversation.schema.js'

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
  ) {}

  async addReaction(messageId: string, userId: string, emoji: string) {
    const message = await this.messageModel.findById(messageId).select('reactions')

    if (!message) {
      throw new HttpException('Message not found!', HttpStatus.NOT_FOUND)
    }

    const existingReaction = message.reactions.find(
      (reaction) => reaction.user.toString() === userId.toString(),
    )

    if (existingReaction) {
      existingReaction.emoji = emoji
    } else {
      message.reactions.push({ user: new Types.ObjectId(userId), emoji })
    }

    await message.save()

    return { message: 'Reaction added successfully!' }
  }

  async editMessage(messageId: string, content: string) {
    const editedAt = new Date()

    const editMessage = await this.messageModel.findOneAndUpdate(
      { _id: messageId },
      { $set: { content, editedAt } },
      { new: true },
    )

    if (!editMessage) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND)
    }

    return {
      message: 'Message edited successfully!',
      messageId: editMessage._id,
      content: editMessage.content,
    }
  }

  async removeMessage(messageId: string, userId: string) {
    const message = await this.messageModel.findById(messageId)

    if (!message) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND)
    }

    if (message.sender.toString() !== userId) {
      throw new HttpException('Not authorized to delete this message', HttpStatus.FORBIDDEN)
    }

    await this.messageModel.findByIdAndDelete(messageId)

    await this.conversationModel.updateOne(
      { messages: messageId },
      { $pull: { messages: messageId } },
    )

    return { message: 'Message deleted successfully!', messageId }
  }
}
