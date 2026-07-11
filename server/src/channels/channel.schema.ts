import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type ChannelDocument = HydratedDocument<Channel>

@Schema({ timestamps: true })
export class Channel {
  @Prop({ required: true, trim: true })
  name: string

  @Prop({ default: '', trim: true })
  description: string

  @Prop(
    raw({
      publicId: { type: String, default: '' },
      url: { type: String, default: '' },
    }),
  )
  avatar: {
    publicId: string
    url: string
  }

  @Prop({
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  })
  visibility: string

  @Prop({
    type: String,
    enum: ['admins', 'members'],
    default: 'admins',
  })
  sendPermissions: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  admins: Types.ObjectId[]

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  members: Types.ObjectId[]

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], default: [] })
  messages: Types.ObjectId[]

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessage: Types.ObjectId

  @Prop({ type: [String], default: [] })
  mediaUrls: string[]
}

export const ChannelSchema = SchemaFactory.createForClass(Channel)

ChannelSchema.index({ name: 'text', description: 'text' })
ChannelSchema.index({ visibility: 1, updatedAt: -1 })
ChannelSchema.index({ members: 1, updatedAt: -1 })
