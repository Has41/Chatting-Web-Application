import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type CallLogDocument = HydratedDocument<CallLog>

@Schema({ timestamps: true })
export class CallLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  peer: Types.ObjectId

  @Prop({ type: String, enum: ['incoming', 'outgoing'], required: true })
  direction: string

  @Prop({ type: String, enum: ['audio', 'video'], required: true })
  type: string

  @Prop({
    type: String,
    enum: ['calling', 'missed', 'declined', 'answered', 'ended', 'unavailable', 'failed'],
    required: true,
    default: 'calling',
  })
  status: string

  @Prop({ type: Date, required: true, default: Date.now })
  startedAt: Date

  @Prop({ type: Date })
  endedAt?: Date

  @Prop({ type: Number, default: 0 })
  durationSeconds: number
}

export const CallLogSchema = SchemaFactory.createForClass(CallLog)

CallLogSchema.index({ owner: 1, startedAt: -1 })
