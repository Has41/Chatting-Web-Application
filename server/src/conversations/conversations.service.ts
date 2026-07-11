import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Conversation, ConversationDocument } from '../users/schemas/conversation.schema.js'
import { Message, MessageDocument } from '../users/schemas/message.schema.js'
import { User, UserDocument } from '../users/schemas/users.schema.js'

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getCurrentConversation(convoId: string) {
    const conversation = await this.conversationModel
      .findById(convoId)
      .populate({
        path: 'groupOwner participants',
        select: 'username displayName profilePicture bio',
        model: 'User',
      })
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'seenBy.user',
          select: 'username displayName profilePicture bio',
          model: 'User',
        },
      })
      .populate('admins', 'username displayName profilePicture bio')
      .select('conversationType groupName groupInfo groupPicture lastMessage admins')

    if (!conversation) {
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND)
    }

    return {
      message: 'Success!',
      conversation,
    }
  }

  async getConversationsOfUser(userId: string) {
    const user = await this.userModel.findById(userId).lean()

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND)
    }

    const conversations = await this.conversationModel
      .find({
        _id: { $in: user.conversations },
      })
      .populate({
        path: 'participants',
        select: 'username displayName profilePicture',
      })
      .populate({
        path: 'lastMessage',
        select: 'content createdAt media',
      })
      .lean()

    return { conversations }
  }

  async getMessagesOfConversation(convoId: string, page: number = 1, limit: number = 20) {
    if (!convoId) {
      throw new HttpException('Conversation ID is required.', HttpStatus.BAD_REQUEST)
    }

    const skip = (page - 1) * limit

    const conversation = await this.conversationModel.findById(convoId).lean()

    if (!conversation) {
      throw new HttpException('Conversation not found.', HttpStatus.NOT_FOUND)
    }

    const messages = await this.messageModel
      .find({
        _id: { $in: conversation.messages },
      })
      .populate({
        path: 'seenBy.user',
        select: 'username displayName profilePicture',
      })
      .populate({
        path: 'reactions.user',
        select: 'username displayName profilePicture',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return { messages }
  }

  async getMediaOfConversation(convoId: string) {
    const convo = await this.conversationModel.findById(convoId).select('messages')

    if (!convo) {
      throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND)
    }

    const files = await this.messageModel
      .find({
        _id: { $in: convo.messages },
        messageType: 'file',
        'media.mediaUrl': { $exists: true, $ne: '' },
      })
      .select('media createdAt sender')
      .sort({ createdAt: -1 })
      .lean()

    return { files }
  }

  async createGroupConversation(
    groupOwnerId: string,
    data: {
      participants: string[]
      groupName?: string
      groupPicture?: any
      groupInfo?: string
    },
  ) {
    const { participants, groupName, groupPicture, groupInfo } = data
    const allParticipants = [...new Set([...participants, groupOwnerId])]

    const users = await this.userModel
      .find({ _id: { $in: allParticipants } })
      .select('displayName username')

    if (allParticipants.length < 3) {
      throw new HttpException('A group must have at least 3 members', HttpStatus.BAD_REQUEST)
    }

    if (users.length !== allParticipants.length) {
      throw new HttpException('Some participants not found', HttpStatus.NOT_FOUND)
    }

    const participantNames = users.map((user) => user.displayName || user.username)
    const defaultGroupName = participantNames.join(', ')
    const finalGroupName = groupName || defaultGroupName

    const newGroupConversation = await this.conversationModel.create({
      groupName: finalGroupName,
      groupPicture,
      groupOwner: groupOwnerId,
      admins: [groupOwnerId],
      participants: participants,
      groupInfo,
      conversationType: 'group',
    })

    await this.userModel.updateMany(
      { _id: { $in: allParticipants } },
      { $addToSet: { conversations: newGroupConversation._id } },
    )

    return newGroupConversation
  }

  async updateGroupConversation(
    convoId: string,
    groupOwnerId: string,
    data: { groupName?: string; groupPicture?: any; groupInfo?: string },
  ) {
    const updateFields: any = {}
    if (data.groupName) updateFields.groupName = data.groupName
    if (data.groupPicture) updateFields.groupPicture = data.groupPicture
    if (data.groupInfo) updateFields.groupInfo = data.groupInfo

    const group = await this.conversationModel.findById(convoId)

    if (!group) {
      throw new HttpException('Group not found!', HttpStatus.NOT_FOUND)
    }

    this.assertGroupAdmin(group, groupOwnerId)

    const updatedGroup = await this.conversationModel.findOneAndUpdate(
      { _id: convoId },
      { $set: updateFields },
      { new: true },
    )

    if (!updatedGroup) {
      throw new HttpException('Group not found or unauthorized!', HttpStatus.NOT_FOUND)
    }

    return { message: 'Group updated successfully!', group: updatedGroup }
  }

  async leaveGroupConversation(convoId: string, userId: string) {
    const group = await this.conversationModel.findById(convoId)

    if (!group) {
      throw new HttpException('Group not found!', HttpStatus.NOT_FOUND)
    }

    if (group.groupOwner?.toString() === userId) {
      throw new HttpException('Group owner cannot leave. Transfer ownership or delete the group first.', HttpStatus.BAD_REQUEST)
    }

    const isParticipant = group.participants.some((participant) => participant.toString() === userId)
    if (!isParticipant) {
      throw new HttpException('You are not a participant in this group.', HttpStatus.FORBIDDEN)
    }

    await this.conversationModel.updateOne(
      { _id: convoId },
      {
        $pull: {
          participants: userId,
          admins: userId,
        },
      },
    )
    await this.userModel.updateOne(
      { _id: userId },
      { $pull: { conversations: convoId } },
    )

    return { message: 'Group left successfully!' }
  }

  async removeGroupConversation(convoId: string, groupOwnerId: string) {
    const removeGroupConversation = await this.conversationModel.findOneAndDelete({
      _id: convoId,
      groupOwner: groupOwnerId,
    })

    if (!removeGroupConversation) {
      throw new HttpException('Group not found or unauthorized!', HttpStatus.NOT_FOUND)
    }

    return { message: 'Group deleted successfully!' }
  }

  async addGroupParticipants(convoId: string, groupOwnerId: string, participants: string[]) {
    const group = await this.conversationModel.findById(convoId)

    if (!group) {
      throw new HttpException('Group not found!', HttpStatus.NOT_FOUND)
    }

    this.assertGroupAdmin(group, groupOwnerId)

    const existingParticipantIds = new Set(
      group.participants.map((participantId) => participantId.toString()),
    )

    const newParticipants = participants.filter(
      (participantId) => !existingParticipantIds.has(participantId),
    )

    if (newParticipants.length === 0) {
      throw new HttpException(
        'All participants are already in the group!',
        HttpStatus.BAD_REQUEST,
      )
    }

    const users = await this.userModel.find({ _id: { $in: newParticipants } }).select('_id')
    if (users.length !== newParticipants.length) {
      throw new HttpException('Some participants not found', HttpStatus.NOT_FOUND)
    }

    const updatedGroup = await this.conversationModel.findOneAndUpdate(
      { _id: convoId },
      {
        $addToSet: {
          participants: { $each: newParticipants },
        },
      },
      { new: true },
    )

    if (!updatedGroup) {
      throw new HttpException('Group not found or unauthorized!', HttpStatus.NOT_FOUND)
    }

    await this.userModel.updateMany(
      { _id: { $in: newParticipants } },
      { $addToSet: { conversations: convoId } },
    )

    return { message: 'Participants added successfully!', group: updatedGroup }
  }

  async removeGroupParticipants(
    convoId: string,
    groupOwnerId: string,
    participants: string[],
  ) {
    const group = await this.conversationModel.findById(convoId)

    if (!group) {
      throw new HttpException('Group not found!', HttpStatus.NOT_FOUND)
    }

    this.assertGroupAdmin(group, groupOwnerId)

    const ownerId = group.groupOwner?.toString()
    const adminIds = new Set((group.admins ?? []).map((adminId) => adminId.toString()))
    const requestedIds = [...new Set(participants)]

    if (requestedIds.includes(ownerId)) {
      throw new HttpException('Group owner cannot be removed. Transfer ownership first.', HttpStatus.BAD_REQUEST)
    }

    if (group.groupOwner?.toString() !== groupOwnerId && requestedIds.some((participantId) => adminIds.has(participantId))) {
      throw new HttpException('Only the group owner can remove admins.', HttpStatus.FORBIDDEN)
    }

    const removableIds = requestedIds.filter((participantId) =>
      group.participants.some((existingParticipantId) => existingParticipantId.toString() === participantId),
    )

    if (removableIds.length === 0) {
      throw new HttpException('No removable participants found.', HttpStatus.BAD_REQUEST)
    }

    const updatedGroup = await this.conversationModel.findOneAndUpdate(
      { _id: convoId },
      {
        $pull: {
          participants: { $in: removableIds },
          admins: { $in: removableIds },
        },
      },
      { new: true },
    )

    await this.userModel.updateMany(
      { _id: { $in: removableIds } },
      { $pull: { conversations: convoId } },
    )

    return { message: 'Participants removed successfully!', group: updatedGroup }
  }

  async getGroupParticipants(convoId: string) {
    const group = await this.conversationModel
      .findById(convoId)
      .select('participants groupOwner admins')
      .populate('participants groupOwner admins', 'username displayName profilePicture')

    if (!group) {
      throw new HttpException('Group not found!', HttpStatus.NOT_FOUND)
    }

    return {
      message: 'Group participants fetched successfully!',
      participants: group.participants,
      groupOwner: group.groupOwner,
      admins: group.admins ?? [],
    }
  }

  async changeGroupOwnership(convoId: string, userId: string, newOwnerId: string) {
    const group = await this.conversationModel.findById(convoId)

    if (!group) {
      throw new HttpException('Group not found!', HttpStatus.NOT_FOUND)
    }

    if (group.groupOwner?.toString() !== userId) {
      throw new HttpException('Only the group owner can transfer ownership.', HttpStatus.FORBIDDEN)
    }

    const isNewOwnerParticipant = group.participants.some((participantId) => participantId.toString() === newOwnerId)
    if (!isNewOwnerParticipant) {
      throw new HttpException('New owner must be a group participant.', HttpStatus.BAD_REQUEST)
    }

    const updatedParticipants = [
      ...new Set([
        ...group.participants
          .map((participantId) => participantId.toString())
          .filter((participantId) => participantId !== newOwnerId),
        userId,
      ]),
    ]
    const updatedAdmins = [
      ...new Set([
        ...(group.admins ?? [])
          .map((adminId) => adminId.toString())
          .filter((adminId) => adminId !== userId),
        newOwnerId,
      ]),
    ]

    const updatedGroup = await this.conversationModel.findByIdAndUpdate(
      convoId,
      {
        $set: {
          groupOwner: newOwnerId,
          participants: updatedParticipants,
          admins: updatedAdmins,
        },
      },
      { new: true },
    )

    if (!updatedGroup) {
      throw new HttpException('Group not found or conditions not met!', HttpStatus.NOT_FOUND)
    }

    return {
      message: 'Group ownership transferred successfully!',
      groupOwner: updatedGroup.groupOwner,
      participants: updatedGroup.participants,
      admins: updatedGroup.admins,
    }
  }

  async promoteGroupAdmin(convoId: string, ownerId: string, targetUserId: string) {
    const group = await this.conversationModel.findById(convoId)

    if (!group) {
      throw new HttpException('Group not found!', HttpStatus.NOT_FOUND)
    }

    this.assertGroupOwner(group, ownerId)

    const isParticipant = group.participants.some((participantId) => participantId.toString() === targetUserId)
    if (!isParticipant) {
      throw new HttpException('Only group participants can become admins.', HttpStatus.BAD_REQUEST)
    }

    const updatedGroup = await this.conversationModel.findByIdAndUpdate(
      convoId,
      { $addToSet: { admins: targetUserId } },
      { new: true },
    )

    return { message: 'Group admin promoted successfully!', group: updatedGroup }
  }

  async demoteGroupAdmin(convoId: string, ownerId: string, targetUserId: string) {
    const group = await this.conversationModel.findById(convoId)

    if (!group) {
      throw new HttpException('Group not found!', HttpStatus.NOT_FOUND)
    }

    this.assertGroupOwner(group, ownerId)

    if (group.groupOwner?.toString() === targetUserId) {
      throw new HttpException('Group owner cannot be demoted.', HttpStatus.BAD_REQUEST)
    }

    const updatedGroup = await this.conversationModel.findByIdAndUpdate(
      convoId,
      { $pull: { admins: targetUserId } },
      { new: true },
    )

    return { message: 'Group admin demoted successfully!', group: updatedGroup }
  }

  private assertGroupOwner(group: Pick<ConversationDocument, 'groupOwner'>, userId: string) {
    if (group.groupOwner?.toString() !== userId) {
      throw new HttpException('Only the group owner can perform this action.', HttpStatus.FORBIDDEN)
    }
  }

  private assertGroupAdmin(group: Pick<ConversationDocument, 'groupOwner' | 'admins'>, userId: string) {
    const isOwner = group.groupOwner?.toString() === userId
    const isAdmin = (group.admins ?? []).some((adminId) => adminId.toString() === userId)

    if (!isOwner && !isAdmin) {
      throw new HttpException('Only group admins can perform this action.', HttpStatus.FORBIDDEN)
    }
  }
}
