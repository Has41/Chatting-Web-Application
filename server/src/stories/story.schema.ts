import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type StoryDocument = HydratedDocument<Story>

@Schema({ timestamps: true })
export class Story {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner: Types.ObjectId

  @Prop(
    raw({
      mediaUrl: { type: String, required: true },
      publicId: { type: String, default: '' },
      mediaType: { type: String, enum: ['image', 'video'], required: true },
      mimeType: { type: String, default: '' },
      caption: { type: String, default: '' },
    }),
  )
  media: {
    mediaUrl: string
    publicId: string
    mediaType: 'image' | 'video'
    mimeType: string
    caption: string
  }

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ required: true, index: true })
  expiresAt: Date
}

export const StorySchema = SchemaFactory.createForClass(Story)

StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
