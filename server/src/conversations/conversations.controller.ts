import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { ConversationsService } from './conversations.service.js'
import { JwtAuthGuard } from '../auth/jwt.strategy.js'

type AuthenticatedRequest = Request & {
  user?: {
    id: string
  }
}

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('get-current-convo/:convoId')
  async getCurrentConversation(
    @Param('convoId') convoId: string,
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.getCurrentConversation(convoId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('get-current-convo-messages/:convoId')
  async getMessagesOfConversation(
    @Param('convoId') convoId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.getMessagesOfConversation(
      convoId,
      parseInt(page || '1', 10),
      parseInt(limit || '20', 10),
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('get-current-convo-media/:convoId')
  async getMediaOfConversation(
    @Param('convoId') convoId: string,
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.getMediaOfConversation(convoId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('get-group-participants/:convoId')
  async getGroupParticipants(
    @Param('convoId') convoId: string,
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.getGroupParticipants(convoId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('get-conversations')
  async getConversationsOfUser(
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.conversationsService.getConversationsOfUser(userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('create-group')
  async createGroupConversation(
    @Body() body: {
      participants: string[]
      groupName?: string
      groupPicture?: any
      groupInfo?: string
    },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const groupOwnerId = request.user?.id

    if (!groupOwnerId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.conversationsService.createGroupConversation(
      groupOwnerId,
      {
        participants: body.participants,
        groupName: body.groupName,
        groupPicture: body.groupPicture,
        groupInfo: body.groupInfo,
      },
    )
    return response.status(HttpStatus.CREATED).json(result)
  }

  @Patch('edit-group-info/:convoId')
  async updateGroupConversation(
    @Param('convoId') convoId: string,
    @Body() body: { groupName?: string; groupPicture?: any; groupInfo?: string },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const groupOwnerId = request.user?.id

    if (!groupOwnerId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.conversationsService.updateGroupConversation(
      convoId,
      groupOwnerId,
      {
        groupName: body.groupName,
        groupPicture: body.groupPicture,
        groupInfo: body.groupInfo,
      },
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Patch('leave-group/:convoId')
  async leaveGroupConversation(
    @Param('convoId') convoId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.conversationsService.leaveGroupConversation(
      convoId,
      userId,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('add-participants/:convoId')
  async addGroupParticipants(
    @Param('convoId') convoId: string,
    @Body() body: { participants: string[] },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const groupOwnerId = request.user?.id

    if (!groupOwnerId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.conversationsService.addGroupParticipants(
      convoId,
      groupOwnerId,
      body.participants,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('remove-participants/:convoId')
  async removeGroupParticipants(
    @Param('convoId') convoId: string,
    @Body() body: { participants: string[] },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const groupOwnerId = request.user?.id

    if (!groupOwnerId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.conversationsService.removeGroupParticipants(
      convoId,
      groupOwnerId,
      body.participants,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Patch('change-ownership/:convoId/:newOwnerId')
  async changeGroupOwnership(
    @Param('convoId') convoId: string,
    @Param('newOwnerId') newOwnerId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.conversationsService.changeGroupOwnership(
      convoId,
      userId,
      newOwnerId,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('remove-group/:convoId')
  async removeGroupConversation(
    @Param('convoId') convoId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const groupOwnerId = request.user?.id

    if (!groupOwnerId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.conversationsService.removeGroupConversation(
      convoId,
      groupOwnerId,
    )
    return response.status(HttpStatus.OK).json(result)
  }
}
