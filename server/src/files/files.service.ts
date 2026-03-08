import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { Message, MessageDocument } from '../users/schemas/message.schema.js'
import * as cloudinary from 'cloudinary'

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {
    // Configure Cloudinary
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  async generateSignatureUniversal(data: {
    folder: string
    uploadType: string
    mimeType: string
  }) {
    const { folder, uploadType, mimeType } = data

    const timestamp = Math.round(Date.now() / 1000)
    let publicId = ''
    let resourceType = 'auto'
    let transformation: any = undefined
    let format: string | undefined = undefined
    let eager: string | undefined = undefined

    if (mimeType.startsWith('image/')) {
      if (uploadType === 'document' || uploadType === 'other') {
        publicId = `docs_${uuidv4()}`
        resourceType = 'image'
        eager = '_png,w_pg_1,f500'
      } else {
        publicId = `image_${uuidv4()}`
        resourceType = 'image'
        format = 'webp'
        transformation =
          uploadType === 'profile'
            ? 'w_350,h_350,c_limit,f_auto,q_auto'
            : uploadType === 'chat'
            ? 'w_1280,h_720,c_limit,f_auto,q_auto'
            : 'w_500,h_500,c_limit,f_auto,q_auto'
      }
    } else if (mimeType.startsWith('video/')) {
      publicId = `video_${uuidv4()}`
      resourceType = 'video'
      format = 'webm'
      transformation =
        uploadType === 'status'
          ? 'w_720,h_720,c_limit,f_auto,q_auto,so_0'
          : uploadType === 'chat'
          ? 'w_1280,h_720,c_limit,f_auto,q_auto,so_0'
          : 'w_1080,h_720,c_limit,f_auto,q_auto,so_0'
    } else if (mimeType.startsWith('audio/')) {
      console.log('I am an audio file')
      publicId = `audio_${uuidv4()}`
      resourceType = 'video'
      format = 'mp3'
      transformation = 'q_60'
    } else if (mimeType.startsWith('application/pdf')) {
      publicId = `pdf_${uuidv4()}`
      resourceType = 'image'
      eager = 'pg_1,f_png,w_500,h_700,c_fit,q_auto'
    } else {
      publicId = `docs_${uuidv4()}`
      resourceType = 'raw'
      eager = 'pg_1,f_png,w_500,h_700,c_fit,q_auto'
    }

    const paramsToSign: any = {
      timestamp,
      public_id: publicId,
      folder,
    }

    if (transformation) paramsToSign.transformation = transformation
    if (format) paramsToSign.format = format
    if (eager) paramsToSign.eager = eager

    const signature = cloudinary.v2.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET || '',
    )

    return {
      signature,
      timestamp,
      public_id: publicId,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      format,
      transformation,
      eager,
      resource_type: resourceType,
    }
  }

  async deleteCloudinaryMediaMessage(publicId: string, messageId: string) {
    try {
      const result = await cloudinary.v2.uploader.destroy(publicId)

      if (result.result === 'ok' || result.result === 'not_found') {
        if (messageId) {
          const deleteResult = await this.messageModel.deleteOne({ _id: messageId })

          if (deleteResult.deletedCount === 0) {
            return {
              message: 'Media deleted from Cloudinary, but message not found in DB',
            }
          }
        }
        return { message: 'Deleted successfully' }
      } else {
        throw new HttpException('Failed to delete', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    } catch (error) {
      console.error('Cloudinary deletion error:', error)
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
