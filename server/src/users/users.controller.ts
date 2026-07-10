import {
  Controller,
  Get,
  Patch,
  Delete,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { UsersService } from './users.service.js'
import { JwtAuthGuard } from '../auth/jwt.strategy.js'

type AuthenticatedRequest = Request & {
  user?: {
    id: string
  }
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-info')
  async getUserInfo(@Req() request: AuthenticatedRequest, @Res() response: Response) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const user = await this.usersService.getUserInfo(userId)
    return response.status(HttpStatus.OK).json(user)
  }

  @Get('get-info/:userId')
  async getUserById(@Param('userId') userId: string, @Res() response: Response) {
    const user = await this.usersService.getUserById(userId)
    return response.status(HttpStatus.OK).json(user)
  }

  @Patch('edit-info')
  async editUserInfo(
    @Body() body: any,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.editUserInfo(userId, body)
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('delete-account')
  async deleteUserAcc(@Req() request: AuthenticatedRequest, @Res() response: Response) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.deleteUserAcc(userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('add-interests')
  async addUserInterest(
    @Body() body: { newInterest: string },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.addUserInterest(userId, body.newInterest)
    return response.status(HttpStatus.CREATED).json(result)
  }

  @Delete('remove-interests')
  async removeUserInterest(
    @Body() body: { interestToRemove: string },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.removeUserInterest(userId, body.interestToRemove)
    return response.status(HttpStatus.OK).json(result)
  }

  @Patch('toggle-darkmode')
  async toggleDarkMode(
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.toggleDarkMode(userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('send-friend-request/:userId')
  async sendFriendRequest(
    @Param('userId') recipientId: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const senderId = request.user?.id

    if (!senderId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.sendFriendRequest(senderId, recipientId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('respond-friend-request/:userId')
  async respondFriendRequest(
    @Param('userId') senderId: string,
    @Body() body: { response: string },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.respondFriendRequest(userId, senderId, body.response)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('get-friends-and-requests')
  async getFriendsAndRequests(
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.getFriendsAndRequests(userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('get-friends-and-conversations')
  async getFriendsAndConversations(
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.getFriendsAndConversations(userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('remove-friend')
  async removeFriends(
    @Body() body: { friendId: string },
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.removeFriends(userId, body.friendId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('search-user-conversations-data')
  async searchConversationUsersAndContent(
    @Query('dataToSearch') dataToSearch: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.searchConversationUsersAndContent(userId, dataToSearch)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('search-friends-users')
  async searchUsersOrFriends(
    @Query('dataToSearch') dataToSearch: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const userId = request.user?.id

    if (!userId) {
      return response.status(HttpStatus.NOT_FOUND).json({ message: 'Unable to find user.' })
    }

    const result = await this.usersService.searchUsersOrFriends(userId, dataToSearch)
    return response.status(HttpStatus.OK).json(result)
  }
}
