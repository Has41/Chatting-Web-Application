import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common'
import type { Response } from 'express'
import { MessagesService } from './messages.service.js'
import { JwtAuthGuard } from '../auth/jwt.strategy.js'

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('add-reaction/:messageId')
  @UseGuards(JwtAuthGuard)
  async addReaction(
    @Param('messageId') messageId: string,
    @Body() body: { userId: string; emoji: string },
    @Res() response: Response,
  ) {
    const result = await this.messagesService.addReaction(
      messageId,
      body.userId,
      body.emoji,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Patch('edit-message/:messageId')
  @UseGuards(JwtAuthGuard)
  async editMessage(
    @Param('messageId') messageId: string,
    @Body() body: { content: string },
    @Res() response: Response,
  ) {
    const result = await this.messagesService.editMessage(messageId, body.content)
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('remove-message/:messageId')
  @UseGuards(JwtAuthGuard)
  async removeMessage(
    @Param('messageId') messageId: string,
    @Body() body: { userId: string },
    @Res() response: Response,
  ) {
    const result = await this.messagesService.removeMessage(messageId, body.userId)
    return response.status(HttpStatus.OK).json(result)
  }
}
