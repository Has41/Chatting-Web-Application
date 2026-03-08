import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromCookie(request)

    if (!token) {
      throw new HttpException('Token not provided', HttpStatus.UNAUTHORIZED)
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      })
      request['user'] = payload
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED)
      }
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED)
    }

    return true
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.accessToken
  }
}
