import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type MessageDocument = HydratedDocument<Message>

@Schema({ timestamps: true })
export class Message {
  @Prop()
  content: string

  @Prop(
    raw({
      publicId: { type: String, default: '' },
      mediaUrl: { type: String, default: '' },
      thumbnailUrl: { type: String, default: '' },
      caption: { type: String, default: '' },
      mediaType: { type: String, default: '' },
      mimeType: { type: String, default: '' },
      fileName: { type: String, default: '' },
    }),
  )
  media: {
    publicId: string
    mediaUrl: string
    thumbnailUrl: string
    caption: string
    mediaType: string
    mimeType: string
    fileName: string
  }

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User' })
  recipient: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Channel' })
  channel: Types.ObjectId

  @Prop({
    type: String,
    enum: ['text', 'file'],
    required: true,
  })
  messageType: string

  @Prop({
    type: [
      raw({
        user: { type: Types.ObjectId, ref: 'User' },
        seenAt: { type: Date, default: Date.now },
      }),
    ],
    default: [],
  })
  seenBy: {
    user: Types.ObjectId
    seenAt: Date
  }[]

  @Prop({
    type: [
      raw({
        user: { type: Types.ObjectId, ref: 'User' },
        emoji: { type: String, default: '' },
      }),
    ],
    default: [],
  })
  reactions: {
    user: Types.ObjectId
    emoji: string
  }[]

  @Prop()
  editedAt: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)
