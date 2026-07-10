import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt.strategy.js'
import { StoriesService } from './stories.service.js'

type AuthenticatedRequest = Request & {
  user?: {
    id: string
  }
}

@Controller('stories')
@UseGuards(JwtAuthGuard)
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get('active')
  async getActiveStories(@Req() request: AuthenticatedRequest, @Res() response: Response) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.storiesService.getActiveStories(userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post()
  async createStory(
    @Body()
    body: {
      mediaUrl: string
      publicId?: string
      mediaType: 'image' | 'video'
      mimeType?: string
      caption?: string
    },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.storiesService.createStory(userId, body)
    return response.status(HttpStatus.CREATED).json(result)
  }

  @Delete(':storyId')
  async removeStory(
    @Param('storyId') storyId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.storiesService.removeStory(storyId, userId)
    return response.status(HttpStatus.OK).json(result)
  }
}
