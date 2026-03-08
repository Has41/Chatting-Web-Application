import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { Message, MessageSchema } from '../users/schemas/message.schema.js'
import { Conversation, ConversationSchema } from '../users/schemas/conversation.schema.js'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
