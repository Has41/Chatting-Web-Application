import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common'
import type { Response } from 'express'
import { FilesService } from './files.service.js'
import { JwtAuthGuard } from '../auth/jwt.strategy.js'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('generate-signature')
  async generateSignatureUniversal(
    @Body() body: { folder: string; uploadType: string; mimeType: string },
    @Res() response: Response,
  ) {
    const result = await this.filesService.generateSignatureUniversal(body)
    return response.status(HttpStatus.OK).json(result)
  }

  @Delete('delete-media/:publicId/:messageId')
  @UseGuards(JwtAuthGuard)
  async deleteCloudinaryMediaMessage(
    @Param('publicId') publicId: string,
    @Param('messageId') messageId: string,
    @Res() response: Response,
  ) {
    const result = await this.filesService.deleteCloudinaryMediaMessage(publicId, messageId)
    return response.status(HttpStatus.OK).json(result)
  }
}
