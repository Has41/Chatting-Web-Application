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

  async editMessage(messageId: string, userId: string, data: { content?: string; caption?: string }) {
    const editedAt = new Date()

    const message = await this.messageModel.findById(messageId)

    if (!message) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND)
    }

    if (message.sender.toString() !== userId.toString()) {
      throw new HttpException('Not authorized to edit this message', HttpStatus.FORBIDDEN)
    }

    if (message.messageType === 'file') {
      if (typeof data.caption !== 'string') {
        throw new HttpException('Caption is required to edit a file message', HttpStatus.BAD_REQUEST)
      }
      message.media = {
        ...message.media,
        caption: data.caption,
      }
    } else {
      if (typeof data.content !== 'string' || !data.content.trim()) {
        throw new HttpException('Content is required to edit a text message', HttpStatus.BAD_REQUEST)
      }
      message.content = data.content
    }

    message.editedAt = editedAt
    const editMessage = await message.save()

    return {
      message: 'Message edited successfully!',
      messageId: editMessage._id,
      content: editMessage.content,
      caption: editMessage.media?.caption,
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
