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
  HttpStatus,
} from '@nestjs/common'
import type { Response } from 'express'
import { ConversationsService } from './conversations.service.js'
import { JwtAuthGuard } from '../auth/jwt.strategy.js'

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
    @Query('userId') userId: string,
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.getConversationsOfUser(userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('create-group')
  async createGroupConversation(
    @Body() body: {
      groupOwnerId: string
      participants: string[]
      groupName?: string
      groupPicture?: any
      groupInfo?: string
    },
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.createGroupConversation(
      body.groupOwnerId,
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
    @Body() body: { groupOwnerId: string; groupName?: string; groupPicture?: any; groupInfo?: string },
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.updateGroupConversation(
      convoId,
      body.groupOwnerId,
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
    @Body() body: { userId: string },
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.leaveGroupConversation(
      convoId,
      body.userId,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('add-participants/:convoId')
  async addGroupParticipants(
    @Param('convoId') convoId: string,
    @Body() body: { groupOwnerId: string; participants: string[] },
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.addGroupParticipants(
      convoId,
      body.groupOwnerId,
      body.participants,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('remove-participants/:convoId')
  async removeGroupParticipants(
    @Param('convoId') convoId: string,
    @Body() body: { groupOwnerId: string; participants: string[] },
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.removeGroupParticipants(
      convoId,
      body.groupOwnerId,
      body.participants,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Patch('change-ownership/:convoId/:newOwnerId')
  async changeGroupOwnership(
    @Param('convoId') convoId: string,
    @Param('newOwnerId') newOwnerId: string,
    @Body() body: { userId: string },
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.changeGroupOwnership(
      convoId,
      body.userId,
      newOwnerId,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('remove-group/:convoId')
  async removeGroupConversation(
    @Param('convoId') convoId: string,
    @Body() body: { groupOwnerId: string },
    @Res() response: Response,
  ) {
    const result = await this.conversationsService.removeGroupConversation(
      convoId,
      body.groupOwnerId,
    )
    return response.status(HttpStatus.OK).json(result)
  }
}
