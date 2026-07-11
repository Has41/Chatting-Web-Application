import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ChannelsController } from './channels.controller.js'
import { ChannelsService } from './channels.service.js'
import { Channel, ChannelSchema } from './channel.schema.js'
import { Message, MessageSchema } from '../users/schemas/message.schema.js'
import { User, UserSchema } from '../users/schemas/users.schema.js'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Channel.name, schema: ChannelSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
