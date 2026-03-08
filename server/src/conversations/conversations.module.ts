import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConversationsController } from './conversations.controller'
import { ConversationsService } from './conversations.service'
import { Conversation, ConversationSchema } from '../users/schemas/conversation.schema.js'
import { Message, MessageSchema } from '../users/schemas/message.schema.js'
import { User, UserSchema } from '../users/schemas/users.schema.js'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
