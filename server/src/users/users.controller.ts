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
  HttpStatus,
} from '@nestjs/common'
import type { Response } from 'express'
import { UsersService } from './users.service.js'
import { JwtAuthGuard } from '../auth/jwt.strategy.js'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-info')
  async getUserInfo(@Body() body: { userId: string }, @Res() response: Response) {
    const user = await this.usersService.getUserInfo(body.userId)
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
    @Body('userId') userId: string,
    @Res() response: Response,
  ) {
    const result = await this.usersService.editUserInfo(userId, body)
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('delete-account')
  async deleteUserAcc(@Body() body: { userId: string }, @Res() response: Response) {
    const result = await this.usersService.deleteUserAcc(body.userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('add-interests')
  async addUserInterest(
    @Body() body: { userId: string; newInterest: string },
    @Res() response: Response,
  ) {
    const result = await this.usersService.addUserInterest(body.userId, body.newInterest)
    return response.status(HttpStatus.CREATED).json(result)
  }

  @Delete('remove-interests')
  async removeUserInterest(
    @Body() body: { userId: string; interestToRemove: string },
    @Res() response: Response,
  ) {
    const result = await this.usersService.removeUserInterest(body.userId, body.interestToRemove)
    return response.status(HttpStatus.OK).json(result)
  }

  @Patch('toggle-darkmode')
  async toggleDarkMode(
    @Body() body: { userId: string },
    @Res() response: Response,
  ) {
    const result = await this.usersService.toggleDarkMode(body.userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('send-friend-request/:userId')
  async sendFriendRequest(
    @Param('userId') recipientId: string,
    @Body() body: { senderId: string },
    @Res() response: Response,
  ) {
    const result = await this.usersService.sendFriendRequest(body.senderId, recipientId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('respond-friend-request/:userId')
  async respondFriendRequest(
    @Param('userId') senderId: string,
    @Body() body: { userId: string; response: string },
    @Res() response: Response,
  ) {
    const result = await this.usersService.respondFriendRequest(body.userId, senderId, body.response)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('get-friends-and-requests')
  async getFriendsAndRequests(
    @Query('userId') userId: string,
    @Res() response: Response,
  ) {
    const result = await this.usersService.getFriendsAndRequests(userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('get-friends-and-conversations')
  async getFriendsAndConversations(
    @Query('userId') userId: string,
    @Res() response: Response,
  ) {
    const result = await this.usersService.getFriendsAndConversations(userId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('remove-friend')
  async removeFriends(
    @Body() body: { userId: string; friendId: string },
    @Res() response: Response,
  ) {
    const result = await this.usersService.removeFriends(body.userId, body.friendId)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('search-user-conversations-data')
  async searchConversationUsersAndContent(
    @Query('userId') userId: string,
    @Query('dataToSearch') dataToSearch: string,
    @Res() response: Response,
  ) {
    const result = await this.usersService.searchConversationUsersAndContent(userId, dataToSearch)
    return response.status(HttpStatus.OK).json(result)
  }

  @Get('search-friends-users')
  async searchUsersOrFriends(
    @Query('userId') userId: string,
    @Query('dataToSearch') dataToSearch: string,
    @Res() response: Response,
  ) {
    const result = await this.usersService.searchUsersOrFriends(userId, dataToSearch)
    return response.status(HttpStatus.OK).json(result)
  }
}
