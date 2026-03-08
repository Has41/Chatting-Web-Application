import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import type { Response } from 'express'
import { AuthService } from './auth.service.js'
import { RegisterDto } from './dto/register.dto.js'
import { LoginDto } from './dto/login.dto.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const result = await this.authService.login(loginDto, response)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    const result = await this.authService.logout(response)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('verify-otp')
  async verifyOTP(
    @Body() body: { email: string; otp: string },
    @Res() response: Response,
  ) {
    const result = await this.authService.verifyOTP(body.email, body.otp)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('resend-otp')
  async resendOTP(
    @Body() body: { email: string },
    @Res() response: Response,
  ) {
    const result = await this.authService.resendOTP(body.email)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: { email: string },
    @Res() response: Response,
  ) {
    const result = await this.authService.forgotPassword(body.email)
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; otp: string; newPassword: string },
    @Res() response: Response,
  ) {
    const result = await this.authService.resetPassword(
      body.email,
      body.otp,
      body.newPassword,
    )
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('other-details')
  async otherDetails(
    @Body() body: { displayName?: string; dateOfBirth?: string; bio?: string; userId: string },
    @Res() response: Response,
  ) {
    const result = await this.authService.saveOtherDetails(body.userId, {
      displayName: body.displayName,
      dateOfBirth: body.dateOfBirth,
      bio: body.bio,
    })
    return response.status(HttpStatus.OK).json(result)
  }

  @Post('profile-pic')
  async saveProfilePicture(
    @Body() body: { secure_url: string; public_id: string; username: string },
    @Res() response: Response,
  ) {
    const result = await this.authService.saveProfilePicture(
      body.username,
      body.secure_url,
      body.public_id,
    )
    return response.status(HttpStatus.OK).json(result)
  }
}
