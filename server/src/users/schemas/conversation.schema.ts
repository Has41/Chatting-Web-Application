import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type ConversationDocument = HydratedDocument<Conversation>

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[]

  @Prop({
    type: String,
    enum: ['private', 'group', 'channel'],
    required: true,
  })
  conversationType: string

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessage: Types.ObjectId

  @Prop()
  groupName: string

  @Prop(
    raw({
      publicId: { type: String, default: '' },
      url: { type: String, default: '' },
    }),
  )
  groupPicture: {
    publicId: string
    url: string
  }

  @Prop({ type: Types.ObjectId, ref: 'User' })
  groupOwner: Types.ObjectId

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  admins: Types.ObjectId[]

  @Prop({ default: "Hey, we using Chitchat!" })
  groupInfo: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Types.ObjectId[]

  @Prop({ type: [String], default: [] })
  mediaUrls: string[]
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)
