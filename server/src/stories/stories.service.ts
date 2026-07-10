import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Story, StoryDocument } from './story.schema.js'
import { User, UserDocument } from '../users/schemas/users.schema.js'

const STORY_TTL_MS = 24 * 60 * 60 * 1000

@Injectable()
export class StoriesService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createStory(
    userId: string,
    data: {
      mediaUrl: string
      publicId?: string
      mediaType: 'image' | 'video'
      mimeType?: string
      caption?: string
    },
  ) {
    if (!data.mediaUrl || !['image', 'video'].includes(data.mediaType)) {
      throw new HttpException('A valid image or video story is required.', HttpStatus.BAD_REQUEST)
    }

    const story = await this.storyModel.create({
      owner: new Types.ObjectId(userId),
      media: {
        mediaUrl: data.mediaUrl,
        publicId: data.publicId || '',
        mediaType: data.mediaType,
        mimeType: data.mimeType || '',
        caption: data.caption || '',
      },
      expiresAt: new Date(Date.now() + STORY_TTL_MS),
    })

    return story.populate('owner', 'username displayName profilePicture')
  }

  async getActiveStories(userId: string) {
    const currentUser = await this.userModel.findById(userId).select('friends')

    if (!currentUser) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    const visibleOwnerIds = [
      new Types.ObjectId(userId),
      ...currentUser.friends.map((friendId) => new Types.ObjectId(friendId)),
    ]

    const stories = await this.storyModel
      .find({
        owner: { $in: visibleOwnerIds },
        expiresAt: { $gt: new Date() },
      })
      .populate('owner', 'username displayName profilePicture')
      .sort({ createdAt: 1 })
      .lean()

    return stories
  }

  async removeStory(storyId: string, userId: string) {
    const story = await this.storyModel.findOneAndDelete({
      _id: storyId,
      owner: new Types.ObjectId(userId),
    })

    if (!story) {
      throw new HttpException('Story not found.', HttpStatus.NOT_FOUND)
    }

    return { message: 'Story removed successfully.' }
  }
}
