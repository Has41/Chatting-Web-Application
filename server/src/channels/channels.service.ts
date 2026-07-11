import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Channel, ChannelDocument } from './channel.schema.js'
import { Message, MessageDocument } from '../users/schemas/message.schema.js'
import { User, UserDocument } from '../users/schemas/users.schema.js'

type ChannelVisibility = 'public' | 'private'
type ChannelSendPermissions = 'admins' | 'members'

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createChannel(
    ownerId: string,
    data: {
      name: string
      description?: string
      avatar?: any
      visibility?: ChannelVisibility
      sendPermissions?: ChannelSendPermissions
      members?: string[]
    },
  ) {
    if (!data.name?.trim()) {
      throw new HttpException('Channel name is required.', HttpStatus.BAD_REQUEST)
    }

    const owner = await this.userModel.findById(ownerId).select('_id')
    if (!owner) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    const memberIds = [...new Set([ownerId, ...(data.members || [])])]
    const members = await this.userModel.find({ _id: { $in: memberIds } }).select('_id')

    if (members.length !== memberIds.length) {
      throw new HttpException('Some channel members were not found.', HttpStatus.NOT_FOUND)
    }

    const channel = await this.channelModel.create({
      name: data.name.trim(),
      description: data.description?.trim() || '',
      avatar: data.avatar,
      visibility: data.visibility || 'public',
      sendPermissions: data.sendPermissions || 'admins',
      owner: ownerId,
      admins: [ownerId],
      members: memberIds,
    })

    await this.userModel.updateMany(
      { _id: { $in: memberIds } },
      { $addToSet: { channels: channel._id } },
    )

    return { message: 'Channel created successfully!', channel }
  }

  async getMyChannels(userId: string) {
    const channels = await this.channelModel
      .find({ members: userId })
      .populate('owner members admins', 'username displayName profilePicture')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'username displayName profilePicture',
        },
      })
      .sort({ updatedAt: -1 })
      .lean()

    return { channels }
  }

  async getPublicChannels(query = '') {
    const filter: any = { visibility: 'public' }
    if (query.trim()) {
      filter.$text = { $search: query.trim() }
    }

    const channels = await this.channelModel
      .find(filter)
      .populate('owner', 'username displayName profilePicture')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'username displayName profilePicture',
        },
      })
      .sort(query.trim() ? { score: { $meta: 'textScore' } } : { updatedAt: -1 })
      .limit(50)
      .lean()

    return { channels }
  }

  async getChannel(channelId: string, userId: string) {
    const channel = await this.channelModel
      .findById(channelId)
      .populate('owner members admins', 'username displayName profilePicture bio')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'username displayName profilePicture',
        },
      })

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    this.assertCanViewChannel(channel, userId)

    return { channel }
  }

  async joinChannel(channelId: string, userId: string) {
    const channel = await this.channelModel.findById(channelId)

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    if (channel.visibility === 'private') {
      throw new HttpException('Private channels require an invite.', HttpStatus.FORBIDDEN)
    }

    await this.channelModel.updateOne(
      { _id: channelId },
      { $addToSet: { members: userId } },
    )
    await this.userModel.updateOne(
      { _id: userId },
      { $addToSet: { channels: channelId } },
    )

    return { message: 'Joined channel successfully!' }
  }

  async leaveChannel(channelId: string, userId: string) {
    const channel = await this.channelModel.findById(channelId)

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    if (channel.owner.toString() === userId) {
      throw new HttpException('Channel owner cannot leave. Delete the channel or transfer ownership first.', HttpStatus.BAD_REQUEST)
    }

    await this.channelModel.updateOne(
      { _id: channelId },
      {
        $pull: {
          members: userId,
          admins: userId,
        },
      },
    )
    await this.userModel.updateOne(
      { _id: userId },
      { $pull: { channels: channelId } },
    )

    return { message: 'Left channel successfully!' }
  }

  async addChannelMembers(channelId: string, requesterId: string, memberIds: string[]) {
    const channel = await this.channelModel.findById(channelId)

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    this.assertIsAdmin(channel, requesterId)

    const existingMemberIds = new Set(channel.members.map((member) => member.toString()))
    const newMemberIds = [...new Set(memberIds)].filter((memberId) => !existingMemberIds.has(memberId))

    if (newMemberIds.length === 0) {
      throw new HttpException('All selected users are already channel members.', HttpStatus.BAD_REQUEST)
    }

    const users = await this.userModel.find({ _id: { $in: newMemberIds } }).select('_id')
    if (users.length !== newMemberIds.length) {
      throw new HttpException('Some channel members were not found.', HttpStatus.NOT_FOUND)
    }

    const updatedChannel = await this.channelModel.findByIdAndUpdate(
      channelId,
      { $addToSet: { members: { $each: newMemberIds } } },
      { new: true },
    )

    await this.userModel.updateMany(
      { _id: { $in: newMemberIds } },
      { $addToSet: { channels: channelId } },
    )

    return { message: 'Channel members added successfully!', channel: updatedChannel }
  }

  async removeChannelMembers(channelId: string, requesterId: string, memberIds: string[]) {
    const channel = await this.channelModel.findById(channelId)

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    this.assertIsAdmin(channel, requesterId)

    const ownerId = channel.owner.toString()
    const adminIds = new Set((channel.admins ?? []).map((adminId) => adminId.toString()))
    const requestedIds = [...new Set(memberIds)]

    if (requestedIds.includes(ownerId)) {
      throw new HttpException('Channel owner cannot be removed. Transfer ownership first.', HttpStatus.BAD_REQUEST)
    }

    if (ownerId !== requesterId && requestedIds.some((memberId) => adminIds.has(memberId))) {
      throw new HttpException('Only the channel owner can remove admins.', HttpStatus.FORBIDDEN)
    }

    const removableIds = requestedIds.filter((memberId) =>
      channel.members.some((existingMemberId) => existingMemberId.toString() === memberId),
    )

    if (removableIds.length === 0) {
      throw new HttpException('No removable channel members found.', HttpStatus.BAD_REQUEST)
    }

    const updatedChannel = await this.channelModel.findByIdAndUpdate(
      channelId,
      {
        $pull: {
          members: { $in: removableIds },
          admins: { $in: removableIds },
        },
      },
      { new: true },
    )

    await this.userModel.updateMany(
      { _id: { $in: removableIds } },
      { $pull: { channels: channelId } },
    )

    return { message: 'Channel members removed successfully!', channel: updatedChannel }
  }

  async transferChannelOwnership(channelId: string, ownerId: string, newOwnerId: string) {
    const channel = await this.channelModel.findById(channelId)

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    if (channel.owner.toString() !== ownerId) {
      throw new HttpException('Only the channel owner can transfer ownership.', HttpStatus.FORBIDDEN)
    }

    const isMember = channel.members.some((memberId) => memberId.toString() === newOwnerId)
    if (!isMember) {
      throw new HttpException('New owner must be a channel member.', HttpStatus.BAD_REQUEST)
    }

    const updatedAdmins = [
      ...new Set([
        ...(channel.admins ?? [])
          .map((adminId) => adminId.toString())
          .filter((adminId) => adminId !== ownerId),
        newOwnerId,
      ]),
    ]

    const updatedChannel = await this.channelModel.findByIdAndUpdate(
      channelId,
      {
        $set: {
          owner: newOwnerId,
          admins: updatedAdmins,
        },
      },
      { new: true },
    )

    return { message: 'Channel ownership transferred successfully!', channel: updatedChannel }
  }

  async promoteChannelAdmin(channelId: string, ownerId: string, targetUserId: string) {
    const channel = await this.channelModel.findById(channelId)

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    this.assertIsOwner(channel, ownerId)

    const isMember = channel.members.some((memberId) => memberId.toString() === targetUserId)
    if (!isMember) {
      throw new HttpException('Only channel members can become admins.', HttpStatus.BAD_REQUEST)
    }

    const updatedChannel = await this.channelModel.findByIdAndUpdate(
      channelId,
      { $addToSet: { admins: targetUserId } },
      { new: true },
    )

    return { message: 'Channel admin promoted successfully!', channel: updatedChannel }
  }

  async demoteChannelAdmin(channelId: string, ownerId: string, targetUserId: string) {
    const channel = await this.channelModel.findById(channelId)

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    this.assertIsOwner(channel, ownerId)

    if (channel.owner.toString() === targetUserId) {
      throw new HttpException('Channel owner cannot be demoted.', HttpStatus.BAD_REQUEST)
    }

    const updatedChannel = await this.channelModel.findByIdAndUpdate(
      channelId,
      { $pull: { admins: targetUserId } },
      { new: true },
    )

    return { message: 'Channel admin demoted successfully!', channel: updatedChannel }
  }

  async getChannelMessages(channelId: string, userId: string, page = 1, limit = 20) {
    const channel = await this.channelModel.findById(channelId).select('visibility members messages')

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    this.assertCanViewChannel(channel, userId)

    const skip = (page - 1) * limit
    const messages = await this.messageModel
      .find({
        _id: { $in: channel.messages },
      })
      .populate('sender', 'username displayName profilePicture')
      .populate('seenBy.user', 'username displayName profilePicture')
      .populate('reactions.user', 'username displayName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return { messages }
  }

  async getChannelFiles(channelId: string, userId: string) {
    const channel = await this.channelModel.findById(channelId).select('visibility members messages')

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    this.assertCanViewChannel(channel, userId)

    const files = await this.messageModel
      .find({
        _id: { $in: channel.messages },
        messageType: 'file',
        'media.mediaUrl': { $exists: true, $ne: '' },
      })
      .select('media createdAt sender')
      .sort({ createdAt: -1 })
      .lean()

    return { files }
  }

  async createChannelMessage(
    channelId: string,
    senderId: string,
    data: {
      content?: string
      messageType: 'text' | 'file'
      fileData?: any
      clientTempId?: string
    },
  ) {
    const channel = await this.channelModel.findById(channelId)

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    this.assertIsMember(channel, senderId)
    this.assertCanSendMessage(channel, senderId)

    if (data.messageType === 'text' && !data.content?.trim()) {
      throw new HttpException('Message content is required.', HttpStatus.BAD_REQUEST)
    }

    if (data.messageType === 'file' && !data.fileData?.url) {
      throw new HttpException('File data is required.', HttpStatus.BAD_REQUEST)
    }

    const messageDataToCreate: any = {
      sender: new Types.ObjectId(senderId),
      channel: new Types.ObjectId(channelId),
      conversationType: 'channel',
      messageType: data.messageType,
    }

    if (data.messageType === 'text') {
      messageDataToCreate.content = data.content?.trim()
    }

    if (data.messageType === 'file') {
      messageDataToCreate.media = {
        publicId: data.fileData.publicId,
        mediaUrl: data.fileData.url,
        caption: data.fileData.caption || '',
        thumbnailUrl: data.fileData.thumbnailUrl || '',
        mediaType: data.fileData.mediaType || '',
        mimeType: data.fileData.mimeType || '',
        fileName: data.fileData.fileName || '',
      }
    }

    const createdMessage = await this.messageModel.create(messageDataToCreate)

    const update: any = {
      $set: { lastMessage: createdMessage._id },
      $addToSet: { messages: createdMessage._id },
    }

    if (createdMessage.media?.mediaUrl && createdMessage.media.mediaType !== 'audio') {
      update.$addToSet.mediaUrls = createdMessage.media.mediaUrl
    }

    await this.channelModel.updateOne({ _id: channelId }, update)

    const emittedMessage = await this.messageModel
      .findById(createdMessage._id)
      .populate('sender', 'username displayName profilePicture')
      .lean()

    return {
      message: {
        ...emittedMessage,
        clientTempId: data.clientTempId,
      },
    }
  }

  async updateChannel(
    channelId: string,
    userId: string,
    data: {
      name?: string
      description?: string
      avatar?: any
      visibility?: ChannelVisibility
      sendPermissions?: ChannelSendPermissions
    },
  ) {
    const channel = await this.channelModel.findById(channelId)

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    this.assertIsAdmin(channel, userId)

    const updateFields: any = {}
    if (data.name?.trim()) updateFields.name = data.name.trim()
    if (data.description !== undefined) updateFields.description = data.description.trim()
    if (data.avatar) updateFields.avatar = data.avatar
    if (data.visibility) updateFields.visibility = data.visibility
    if (data.sendPermissions) updateFields.sendPermissions = data.sendPermissions

    const updatedChannel = await this.channelModel.findByIdAndUpdate(
      channelId,
      { $set: updateFields },
      { new: true },
    )

    return { message: 'Channel updated successfully!', channel: updatedChannel }
  }

  async deleteChannel(channelId: string, userId: string) {
    const channel = await this.channelModel.findById(channelId)

    if (!channel) {
      throw new HttpException('Channel not found.', HttpStatus.NOT_FOUND)
    }

    if (channel.owner.toString() !== userId) {
      throw new HttpException('Only the channel owner can delete this channel.', HttpStatus.FORBIDDEN)
    }

    await this.messageModel.deleteMany({ channel: channelId })
    await this.channelModel.deleteOne({ _id: channelId })
    await this.userModel.updateMany(
      { channels: channelId },
      { $pull: { channels: channelId } },
    )

    return { message: 'Channel deleted successfully!' }
  }

  private assertCanViewChannel(channel: Pick<ChannelDocument, 'visibility' | 'members'>, userId: string) {
    if (channel.visibility === 'public') return
    this.assertIsMember(channel, userId)
  }

  private assertIsMember(channel: Pick<ChannelDocument, 'members'>, userId: string) {
    const isMember = channel.members.some((member) => member.toString() === userId)
    if (!isMember) {
      throw new HttpException('You are not a member of this channel.', HttpStatus.FORBIDDEN)
    }
  }

  private assertIsAdmin(channel: Pick<ChannelDocument, 'owner' | 'admins'>, userId: string) {
    const isOwner = channel.owner.toString() === userId
    const isAdmin = (channel.admins ?? []).some((admin) => admin.toString() === userId)

    if (!isOwner && !isAdmin) {
      throw new HttpException('Only channel admins can update this channel.', HttpStatus.FORBIDDEN)
    }
  }

  private assertIsOwner(channel: Pick<ChannelDocument, 'owner'>, userId: string) {
    if (channel.owner.toString() !== userId) {
      throw new HttpException('Only the channel owner can perform this action.', HttpStatus.FORBIDDEN)
    }
  }

  private assertCanSendMessage(channel: Pick<ChannelDocument, 'owner' | 'admins' | 'sendPermissions'>, userId: string) {
    if ((channel.sendPermissions || 'admins') === 'members') return

    const isOwner = channel.owner.toString() === userId
    const isAdmin = (channel.admins ?? []).some((admin) => admin.toString() === userId)

    if (!isOwner && !isAdmin) {
      throw new HttpException('Only channel admins can send messages in this channel.', HttpStatus.FORBIDDEN)
    }
  }
}
