import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Message, MessageDocument } from '../users/schemas/message.schema.js'
import { Conversation, ConversationDocument } from '../users/schemas/conversation.schema.js'
import { User, UserDocument } from '../users/schemas/users.schema.js'
import * as gatewayUtils from './gateway.utils.js'

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
    credentials: true,
  },
})
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // ============== CONNECTION HANDLERS ==============

  handleConnection(client: Socket) {
    console.log('Client connected!')
    const userId = client.handshake.query.userId as string

    if (userId) {
      gatewayUtils.setUserSocket(userId, client.id)
    } else {
      client.disconnect(true)
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client Disconnected: ${client.id}`)
    const userId = gatewayUtils.removeSocketUser(client.id)
    if (userId) {
      console.log(`User ${userId} disconnected`)
    }
  }

  // ============== MESSAGE HANDLERS ==============

  @SubscribeMessage('checkIfOnline')
  handleCheckIfOnline(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    const isOnline = gatewayUtils.isUserOnline(userId)
    client.emit('checkIfOnlineResponse', isOnline)
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageData: any; fileData?: any },
  ) {
    const { messageData, fileData } = data
    const { conversationType, conversationId, sender, recipient } = messageData

    // Generate conversation key
    const conversationKey =
      conversationType === 'private' ? gatewayUtils.getPrivateConversationKey(sender, recipient) : conversationId

    const isGroup = conversationType === 'group'

    // Add to queue and return promise
    const promise = gatewayUtils.addToMessageQueue(conversationKey, messageData, fileData)

    // Start processing if not already processing
    this.processMessageQueue(conversationKey, isGroup, client)

    return promise
  }

  @SubscribeMessage('markMessageAsSeen')
  async handleMarkMessageAsSeen(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string; conversationType: string; lastMessageId: string },
  ) {
    const { conversationId, userId, conversationType, lastMessageId } = data

    try {
      const conversation = await this.conversationModel.findById(conversationId)

      if (!conversation) {
        throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND)
      }

      // Validate participant
      const isParticipant = conversation.participants.some((participant) => participant.toString() === userId)

      if (conversationType === 'group') {
        const isGroupOwner = conversation.groupOwner?.toString() === userId
        if (!isParticipant && !isGroupOwner) {
          throw new HttpException(
            'User is neither a participant nor the owner of this group conversation.',
            HttpStatus.FORBIDDEN,
          )
        }
      } else if (conversationType === 'private' && !isParticipant) {
        throw new HttpException('User is not a participant in this private conversation.', HttpStatus.FORBIDDEN)
      }

      const updatedMessage = await this.messageModel.findByIdAndUpdate(
        lastMessageId,
        {
          $addToSet: { seenBy: { user: userId, seenAt: new Date() } },
        },
        { new: true },
      )

      if (!updatedMessage) {
        throw new HttpException('Message not found for updating seenBy', HttpStatus.NOT_FOUND)
      }

      // Emit to the sender that message was seen
      const senderSocketId = gatewayUtils.getUserSocketId(updatedMessage.sender.toString())
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('messageSeen', {
          messageId: lastMessageId,
          seenBy: userId,
        })
      }
    } catch (err) {
      console.error('Error marking message as seen:', err)
    }
  }

  @SubscribeMessage('join-group')
  async handleJoinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string },
  ) {
    const { conversationId, userId } = data

    try {
      const conversation = await this.conversationModel.findById(conversationId)

      if (!conversation) {
        console.error(`Conversation with ID ${conversationId} not found!`)
        return
      }

      const groupOwnerId = conversation.groupOwner?.toString()
      const isParticipant = conversation.participants.some((participant) => participant.toString() === userId)

      if (userId === groupOwnerId || isParticipant) {
        client.join(conversationId)
        console.log(`User ${userId} joined group room: ${conversationId}`)
      } else {
        console.error(`User ${userId} is not authorized to join group room: ${conversationId}`)
      }
    } catch (err) {
      console.error(`Error in joinGroup for conversation ${conversationId} and user ${userId}:`, err)
    }
  }

  // ============== CALL HANDLERS ==============

  @SubscribeMessage('call-user')
  handleCallUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { from: string; to: string; type: string; offer: any },
  ) {
    const { from, to, type, offer } = data
    console.log(`📞 ${from} is calling ${to} (${type})`)
    const recipientSocketId = gatewayUtils.getUserSocketId(to)
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('incoming-call', { from, type, offer })
    }
  }

  @SubscribeMessage('answer-call')
  handleAnswerCall(@ConnectedSocket() client: Socket, @MessageBody() data: { from: string; to: string; answer: any }) {
    const { from, to, answer } = data
    console.log(`✅ ${from} accepted call from ${to}`)
    const recipientSocketId = gatewayUtils.getUserSocketId(to)
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('call-accepted', { from, answer })
    }
  }

  @SubscribeMessage('reject-call')
  handleRejectCall(@ConnectedSocket() client: Socket, @MessageBody() data: { from: string; to: string }) {
    const { from, to } = data
    console.log(`❌ ${from} rejected call from ${to}`)
    const recipientSocketId = gatewayUtils.getUserSocketId(to)
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('call-rejected', { from })
    }
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { from: string; to: string; candidate: any },
  ) {
    const { from, to, candidate } = data
    const recipientSocketId = gatewayUtils.getUserSocketId(to)
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('ice-candidate', { from, candidate })
    }
  }

  @SubscribeMessage('end-call')
  handleEndCall(@ConnectedSocket() client: Socket, @MessageBody() data: { from: string }) {
    const { from } = data
    console.log(`🔚 Call ended by ${from}`)
    client.broadcast.emit('end-call', { from })
  }

  // ============== QUEUE PROCESSOR ==============

  /**
   * Process message queue for a specific conversation
   * Handles one message at a time to prevent race conditions
   */
  async processMessageQueue(conversationKey: string, isGroup: boolean, client: Socket) {
    // If already processing, don't start another processor
    if (gatewayUtils.isProcessing(conversationKey)) {
      return
    }

    gatewayUtils.setProcessing(conversationKey, true)

    try {
      while (gatewayUtils.hasQueuedMessages(conversationKey)) {
        const queueItem = gatewayUtils.getNextFromQueue(conversationKey)
        if (!queueItem) break

        const { messageData, fileData, resolve, reject } = queueItem

        try {
          const result = await this.processMessage(messageData, fileData, conversationKey, isGroup, client)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }
    } finally {
      gatewayUtils.setProcessing(conversationKey, false)
      gatewayUtils.clearQueue(conversationKey)
    }
  }

  /**
   * Process a single message
   */
  private async processMessage(
    messageData: any,
    fileData: any,
    conversationKey: string,
    isGroup: boolean,
    client: Socket,
  ) {
    const { conversationType, conversationId, sender, recipient, content, messageType } = messageData

    // Create the message first
    const messageDataToCreate: any = {
      sender: new Types.ObjectId(sender),
      messageType,
      conversationType,
    }

    if (conversationType === 'group') {
      messageDataToCreate.conversation = new Types.ObjectId(conversationId)
    } else {
      messageDataToCreate.recipient = new Types.ObjectId(recipient)
    }

    if (messageType === 'text') {
      messageDataToCreate.content = content
    }

    if (fileData && messageType === 'file') {
      messageDataToCreate.media = {
        publicId: fileData.publicId,
        mediaUrl: fileData.url,
        caption: fileData.caption || '',
        thumbnailUrl: fileData.thumbnailUrl || '',
      }
    }

    const createdMessage = await this.messageModel.create(messageDataToCreate)

    // Get or create conversation (use cache if available)
    let conversation: ConversationDocument | null = null

    if (conversationType === 'private') {
      // Check cache first
      const cached = gatewayUtils.getCachedConversation(conversationKey)
      if (cached) {
        conversation = cached
        conversation.lastMessage = createdMessage._id
        conversation.messages.push(createdMessage._id)
        await conversation.save()
      } else {
        // Find existing or create new (prevents duplicates)
        conversation = await this.conversationModel.findOneAndUpdate(
          { participants: { $all: [sender, recipient] }, conversationType: 'private' },
          {
            $set: { lastMessage: createdMessage._id },
            $addToSet: { messages: createdMessage._id },
          },
          { new: true, upsert: true },
        )
        // Cache it
        gatewayUtils.setCachedConversation(conversationKey, conversation)
      }

      // Update users
      await this.userModel.updateMany(
        { _id: { $in: [sender, recipient] } },
        { $addToSet: { conversations: conversation._id } },
      )
    } else if (conversationType === 'group') {
      // For groups, use conversationId as key
      const cachedGroup = gatewayUtils.getCachedConversation(conversationId)
      if (cachedGroup) {
        conversation = cachedGroup
        conversation.lastMessage = createdMessage._id
        conversation.messages.push(createdMessage._id)
        if (createdMessage.media && !createdMessage.media.mediaUrl?.endsWith('.mp3')) {
          conversation.mediaUrls.push(createdMessage.media.mediaUrl)
        }
        await conversation.save()
      } else {
        conversation = await this.conversationModel.findByIdAndUpdate(
          conversationId,
          {
            $set: { lastMessage: createdMessage._id },
            $addToSet: {
              messages: createdMessage._id,
              ...(createdMessage.media && !createdMessage.media.mediaUrl?.endsWith('.mp3')
                ? { mediaUrls: createdMessage.media.mediaUrl }
                : {}),
            },
          },
          { new: true },
        )

        if (!conversation) {
          throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND)
        }

        // Cache it
        gatewayUtils.setCachedConversation(conversationId, conversation)
      }

      // Update group members
      await this.userModel.updateMany(
        { _id: { $in: conversation.participants } },
        { $addToSet: { conversations: conversation._id } },
      )
    }

    // Emit the message
    const senderSocketId = gatewayUtils.getUserSocketId(sender)
    if (conversationType === 'private') {
      const recipientSocketId = gatewayUtils.getUserSocketId(recipient)
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('receiveMessage', createdMessage)
      }
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('receiveMessage', createdMessage)
      }
    } else if (conversationType === 'group') {
      client.to(conversationId).emit('receive-group-messages', createdMessage, conversation._id)
    }

    return { message: createdMessage, conversation }
  }
}
