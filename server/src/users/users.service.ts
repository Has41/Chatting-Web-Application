import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User, UserDocument } from './schemas/users.schema.js'
import { Conversation, ConversationDocument } from './schemas/conversation.schema.js'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const createdUser = await this.userModel.create(userData)
    return createdUser
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec()
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec()
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec()
  }

  async findOne(query: any): Promise<User | null> {
    return this.userModel.findOne(query).exec()
  }

  async getUserInfo(userId: string) {
    const userData = await this.userModel.findById(userId).select(
      'username email profilePicture displayName phoneNumber dateOfBirth gender location bio interests friendRequests friends',
    )

    if (!userData) {
      throw new HttpException('User data not found!', HttpStatus.NOT_FOUND)
    }

    return userData
  }

  async getUserById(userId: string) {
    const userData = await this.userModel.findById(userId).select(
      'username profilePicture displayName',
    )

    if (!userData) {
      throw new HttpException('User data not found!', HttpStatus.NOT_FOUND)
    }

    return userData
  }

  async editUserInfo(userId: string, updateData: any) {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    })

    if (!updatedUser) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    return {
      message: 'User profile updated successfully.',
      user: updatedUser,
    }
  }

  async deleteUserAcc(userId: string) {
    const deleteAccount = await this.userModel.findByIdAndDelete(userId)

    if (!deleteAccount) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    return { message: 'User deleted successfully.', user: deleteAccount }
  }

  async addUserInterest(userId: string, newInterest: string) {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        interests: { $ne: newInterest },
        'interests.4': { $exists: false },
      },
      { $push: { interests: newInterest } },
      { new: true },
    )

    if (!user) {
      throw new HttpException(
        'Interest already exists or maximum number of interests reached.',
        HttpStatus.FORBIDDEN,
      )
    }

    return { message: 'Interest added successfully.' }
  }

  async removeUserInterest(userId: string, interestToRemove: string) {
    if (!interestToRemove) {
      throw new HttpException('Interest cannot be empty or null.', HttpStatus.BAD_REQUEST)
    }

    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        interests: interestToRemove,
      },
      { $pull: { interests: interestToRemove } },
      { new: true },
    )

    if (!user) {
      throw new HttpException('Interest not found or user not found.', HttpStatus.NOT_FOUND)
    }

    return { message: 'Interest removed successfully!' }
  }

  async toggleDarkMode(userId: string) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $bit: { darkMode: { $not: '$darkMode' } } },
      { new: true },
    )

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    return { message: 'Preference updated successfully!' }
  }

  async sendFriendRequest(senderId: string, recipientId: string) {
    if (senderId === recipientId) {
      throw new HttpException(
        'You cannot send a friend request to yourself!',
        HttpStatus.BAD_REQUEST,
      )
    }

    const recipient = await this.userModel.findOneAndUpdate(
      { _id: recipientId, 'friendRequests.from': { $ne: senderId } },
      { $push: { friendRequests: { from: new Types.ObjectId(senderId) } } },
      { new: true },
    )

    if (!recipient) {
      throw new HttpException(
        'Recipient not found or request already sent!',
        HttpStatus.NOT_FOUND,
      )
    }

    return { message: 'Friend request sent successfully!' }
  }

  async respondFriendRequest(userId: string, senderId: string, response: string) {
    const userData = await this.userModel.findById(userId)
    const recipientData = await this.userModel.findById(senderId)

    if (!userData || !recipientData) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND)
    }

    const verifyFriendRequest = await this.userModel.findOne({
      _id: userId,
      'friendRequests.from': new Types.ObjectId(senderId),
    })

    if (!verifyFriendRequest) {
      throw new HttpException('Friend request not found!', HttpStatus.NOT_FOUND)
    }

    const specificRequestIndex = userData.friendRequests.findIndex(
      (result) => result.from.toString() === senderId.toString(),
    )

    if (specificRequestIndex === -1) {
      throw new HttpException('Request not found!', HttpStatus.NOT_FOUND)
    }

    if (response === 'accepted') {
      userData.friends.push(new Types.ObjectId(senderId))
      recipientData.friends.push(new Types.ObjectId(userId))
      await recipientData.save()
    }

    userData.friendRequests.splice(specificRequestIndex, 1)
    await userData.save()

    return {
      message: 'Friend request updated successfully!',
    }
  }

  async getFriendsAndRequests(userId: string) {
    const userData = await this.userModel.findById(userId)
      .select('friendRequests friends')
      .populate('friendRequests.from friends', 'username profilePicture displayName _id')

    if (!userData) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND)
    }

    return userData
  }

  async getFriendsAndConversations(userId: string) {
    const user = await this.userModel.findById(userId).select('friends conversations').populate({
      path: 'friends',
      select: 'username profilePicture displayName _id',
    })

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND)
    }

    const conversations = await this.conversationModel.aggregate([
      {
        $match: {
          _id: { $in: user.conversations },
          conversationType: { $ne: 'group' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants',
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessageData',
        },
      },
      {
        $unwind: {
          path: '$lastMessageData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          participants: {
            $filter: {
              input: '$participants',
              as: 'participant',
              cond: { $ne: ['$$participant._id', { $toObjectId: userId }] },
            },
          },
        },
      },
      {
        $addFields: {
          isFriend: {
            $in: [{ $arrayElemAt: ['$participants._id', 0] }, user.friends],
          },
        },
      },
      {
        $project: {
          _id: 1,
          participants: {
            _id: 1,
            username: 1,
            profilePicture: 1,
          },
          lastMessageData: {
            content: 1,
            createdAt: 1,
            sender: 1,
          },
          isFriend: 1,
          groupName: 1,
          conversationType: 1,
          groupPicture: 1,
        },
      },
    ])

    return {
      friends: user.friends,
      conversations,
    }
  }

  async removeFriends(userId: string, friendId: string) {
    const currentuserData = await this.userModel.findById(userId)
    const friendData = await this.userModel.findById(friendId)

    if (!currentuserData || !friendData) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND)
    }

    const verifyFriend = currentuserData.friends.some(
      (id) => id.toString() === friendId.toString(),
    )

    if (!verifyFriend) {
      throw new HttpException('Friend not found!', HttpStatus.NOT_FOUND)
    }

    const specificUserFriendIndex = currentuserData.friends.findIndex(
      (id) => id.toString() === friendId.toString(),
    )
    currentuserData.friends.splice(specificUserFriendIndex, 1)

    const specificFriendIndex = friendData.friends.findIndex(
      (id) => id.toString() === userId.toString(),
    )
    friendData.friends.splice(specificFriendIndex, 1)

    await currentuserData.save()
    await friendData.save()

    return { message: 'Friend removed successfully!' }
  }

  async searchConversationUsersAndContent(userId: string, dataToSearch: string) {
    const user = await this.userModel.findById(userId).select('conversations friends')

    if (!user || !user.conversations.length) {
      return []
    }

    const conversation = await this.conversationModel.aggregate([
      {
        $match: {
          _id: { $in: user.conversations },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participantsData',
        },
      },
      {
        $addFields: {
          participantsData: {
            $map: {
              input: '$participantsData',
              as: 'participant',
              in: {
                _id: '$$participant._id',
                username: '$$participant.username',
                profilePicture: '$$participant.profilePicture',
                displayName: '$$participant.displayName',
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'messages',
          foreignField: '_id',
          as: 'messagesData',
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessageData',
        },
      },
      {
        $unwind: {
          path: '$lastMessageData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { 'participantsData.username': { $regex: dataToSearch, $options: 'i' } },
            { 'messagesData.content': { $regex: dataToSearch, $options: 'i' } },
          ],
        },
      },
      {
        $project: {
          groupName: 1,
          conversationType: 1,
          participants: '$participantsData',
          messages: '$messagesData',
          lastMessageData: '$lastMessageData',
          groupPicture: 1,
        },
      },
    ])

    const friendsData = await this.userModel
      .find({ _id: { $in: user.friends } })
      .select('_id username displayName profilePicture conversations')

    return { conversation, friendsData }
  }

  async searchUsersOrFriends(userId: string, dataToSearch: string) {
    const currentUser = await this.userModel.findById(userId).select('friends')
    if (!currentUser) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND)
    }

    const friendsIds = currentUser.friends.map((friend) => friend.toString())

    const searchQuery = {
      _id: { $ne: new Types.ObjectId(userId) },
      $or: [
        { username: { $regex: dataToSearch, $options: 'i' } },
        { displayName: { $regex: dataToSearch, $options: 'i' } },
      ],
    }

    const users = await this.userModel
      .find(searchQuery)
      .select('username displayName profilePicture friendRequests')
      .lean()

    const queryResults = users.map((user) => ({
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      profilePicture: user.profilePicture,
      isFriend: friendsIds.includes(user._id.toString()),
      isRequestSent: user.friendRequests.some(
        (req) => req.from.toString() === userId && req.status === 'pending',
      ),
    }))

    return queryResults
  }
}
