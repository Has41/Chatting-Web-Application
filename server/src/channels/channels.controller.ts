import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt.strategy.js'
import { ChannelsService } from './channels.service.js'

type AuthenticatedRequest = Request & {
  user?: {
    id: string
  }
}

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  async createChannel(
    @Body()
    body: {
      name: string
      description?: string
      avatar?: any
      visibility?: 'public' | 'private'
      sendPermissions?: 'admins' | 'members'
      members?: string[]
    },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.createChannel(userId, body)
    return response.status(HttpStatus.CREATED).json(result)
  }

  @Get('my')
  async getMyChannels(@Req() request: AuthenticatedRequest, @Res() response: Response) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.getMyChannels(userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('public')
  async getPublicChannels(@Query('q') query: string, @Res() response: Response) {
    const result = await this.channelsService.getPublicChannels(query || '')
    return response.status(HttpStatus.OK).json(result)
  }

  @Get(':channelId')
  async getChannel(
    @Param('channelId') channelId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.getChannel(channelId, userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post(':channelId/join')
  async joinChannel(
    @Param('channelId') channelId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.joinChannel(channelId, userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post(':channelId/leave')
  async leaveChannel(
    @Param('channelId') channelId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.leaveChannel(channelId, userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post(':channelId/members')
  async addChannelMembers(
    @Param('channelId') channelId: string,
    @Body() body: { members: string[] },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.addChannelMembers(channelId, userId, body.members || [])
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete(':channelId/members')
  async removeChannelMembers(
    @Param('channelId') channelId: string,
    @Body() body: { members: string[] },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.removeChannelMembers(channelId, userId, body.members || [])
    return response.status(HttpStatus.OK).json(result)
  }

  @Patch(':channelId/transfer-ownership/:newOwnerId')
  async transferChannelOwnership(
    @Param('channelId') channelId: string,
    @Param('newOwnerId') newOwnerId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.transferChannelOwnership(channelId, userId, newOwnerId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Patch(':channelId/promote-admin/:targetUserId')
  async promoteChannelAdmin(
    @Param('channelId') channelId: string,
    @Param('targetUserId') targetUserId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.promoteChannelAdmin(channelId, userId, targetUserId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Patch(':channelId/demote-admin/:targetUserId')
  async demoteChannelAdmin(
    @Param('channelId') channelId: string,
    @Param('targetUserId') targetUserId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.demoteChannelAdmin(channelId, userId, targetUserId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get(':channelId/messages')
  async getChannelMessages(
    @Param('channelId') channelId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.getChannelMessages(
      channelId,
      userId,
      parseInt(page || '1', 10),
      parseInt(limit || '20', 10),
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Get(':channelId/files')
  async getChannelFiles(
    @Param('channelId') channelId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.getChannelFiles(channelId, userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post(':channelId/messages')
  async createChannelMessage(
    @Param('channelId') channelId: string,
    @Body()
    body: {
      content?: string
      messageType: 'text' | 'file'
      fileData?: any
      clientTempId?: string
    },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.createChannelMessage(channelId, userId, body)
    return response.status(HttpStatus.CREATED).json(result)
  }

  @Patch(':channelId')
  async updateChannel(
    @Param('channelId') channelId: string,
    @Body()
    body: {
      name?: string
      description?: string
      avatar?: any
      visibility?: 'public' | 'private'
      sendPermissions?: 'admins' | 'members'
    },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.updateChannel(channelId, userId, body)
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete(':channelId')
  async deleteChannel(
    @Param('channelId') channelId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.channelsService.deleteChannel(channelId, userId)
    return response.status(HttpStatus.OK).json(result)
  }
}
