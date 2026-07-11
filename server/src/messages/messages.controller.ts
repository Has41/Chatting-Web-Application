import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { MessagesService } from './messages.service.js'
import { JwtAuthGuard } from '../auth/jwt.strategy.js'

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('add-reaction/:messageId')
  @UseGuards(JwtAuthGuard)
  async addReaction(
    @Param('messageId') messageId: string,
    @Body() body: { emoji: string },
    @Req() request: Request & { user: { id: string } },
    @Res() response: Response,
  ) {
    const result = await this.messagesService.addReaction(
      messageId,
      request.user.id,
      body.emoji,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Patch('edit-message/:messageId')
  @UseGuards(JwtAuthGuard)
  async editMessage(
    @Param('messageId') messageId: string,
    @Body() body: { content?: string; caption?: string },
    @Req() request: Request & { user: { id: string } },
    @Res() response: Response,
  ) {
    const result = await this.messagesService.editMessage(messageId, request.user.id, body)
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('remove-message/:messageId')
  @UseGuards(JwtAuthGuard)
  async removeMessage(
    @Param('messageId') messageId: string,
    @Req() request: Request & { user: { id: string } },
    @Res() response: Response,
  ) {
    const result = await this.messagesService.removeMessage(messageId, request.user.id)
    return response.status(HttpStatus.OK).json(result)
  }
}
