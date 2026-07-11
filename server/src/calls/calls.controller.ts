import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt.strategy.js'
import { CallsService } from './calls.service.js'

type AuthenticatedRequest = Request & {
  user: {
    id: string
  }
}

@Controller('calls')
@UseGuards(JwtAuthGuard)
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get()
  async getCallLogs(@Req() request: AuthenticatedRequest, @Res() response: Response) {
    const result = await this.callsService.getCallLogs(request.user.id)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post()
  async createCallLog(
    @Body()
    body: {
      peerId: string
      direction: 'incoming' | 'outgoing'
      type: 'audio' | 'video'
      status?: 'calling' | 'missed' | 'declined' | 'answered' | 'ended' | 'unavailable' | 'failed'
      startedAt?: string
    },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const result = await this.callsService.createCallLog(request.user.id, body)
    return response.status(HttpStatus.CREATED).json(result)
  }

  @Patch(':callLogId')
  async updateCallLog(
    @Param('callLogId') callLogId: string,
    @Body()
    body: {
      status?: 'calling' | 'missed' | 'declined' | 'answered' | 'ended' | 'unavailable' | 'failed'
      endedAt?: string
      durationSeconds?: number
    },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const result = await this.callsService.updateCallLog(request.user.id, callLogId, body)
    return response.status(HttpStatus.OK).json(result)
  }
}
