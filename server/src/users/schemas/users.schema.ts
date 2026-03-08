import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop(
    raw({
      publicId: { type: String, default: '' },
      url: { type: String, default: '' },
    }),
  )
  profilePicture: {
    publicId: string
    url: string
  }

  @Prop()
  displayName: string

  @Prop()
  phoneNumber: string

  @Prop()
  dateOfBirth: string

  @Prop({ default: false })
  darkMode: boolean

  @Prop({
    type: String,
    enum: ['Male', 'Female', 'Prefer not to say'],
    default: 'Prefer not to say',
  })
  gender: string

  @Prop({ default: 'Pakistan' })
  location: string

  @Prop({ default: 'Hey, using this app' })
  bio: string

  @Prop({ type: [String], default: [] })
  interests: string[]

  @Prop({ default: false })
  verification: boolean

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  friends: Types.ObjectId[]

  @Prop({
    type: [
      raw({
        from: { type: Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
      }),
    ],
    default: [],
  })
  friendRequests: {
    from: Types.ObjectId
    status: 'pending' | 'accepted' | 'rejected'
  }[]

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Conversation' }] })
  conversations: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
