import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ConversationsModule } from './conversations/conversations.module'
import { MessagesModule } from './messages/messages.module'
import { FilesModule } from './files/files.module'
import { GatewayModule } from './gateway/gateway.module'
import { StoriesModule } from './stories/stories.module'
import { ChannelsModule } from './channels/channels.module'

try {
  process.loadEnvFile?.()
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
    throw error
  }
}

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_CONNECT || 'mongodb://localhost/nest'),
    UsersModule,
    AuthModule,
    ConversationsModule,
    MessagesModule,
    FilesModule,
    GatewayModule,
    StoriesModule,
    ChannelsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
