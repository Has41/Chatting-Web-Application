import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SocketGateway } from './socket.gateway.js'
import { Message, MessageSchema } from '../users/schemas/message.schema.js'
import { Conversation, ConversationSchema } from '../users/schemas/conversation.schema.js'
import { User, UserSchema } from '../users/schemas/users.schema.js'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class GatewayModule {}
