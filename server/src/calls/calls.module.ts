import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CallsController } from './calls.controller.js'
import { CallsService } from './calls.service.js'
import { CallLog, CallLogSchema } from './call-log.schema.js'
import { User, UserSchema } from '../users/schemas/users.schema.js'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CallLog.name, schema: CallLogSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule {}
