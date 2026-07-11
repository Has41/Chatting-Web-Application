import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CallLog, CallLogDocument } from './call-log.schema.js'
import { User, UserDocument } from '../users/schemas/users.schema.js'

type CallLogStatus =
  | 'calling'
  | 'missed'
  | 'declined'
  | 'answered'
  | 'ended'
  | 'unavailable'
  | 'failed'

type CreateCallLogInput = {
  peerId: string
  direction: 'incoming' | 'outgoing'
  type: 'audio' | 'video'
  status?: CallLogStatus
  startedAt?: string
}

type UpdateCallLogInput = {
  status?: CallLogStatus
  endedAt?: string
  durationSeconds?: number
}

@Injectable()
export class CallsService {
  constructor(
    @InjectModel(CallLog.name) private callLogModel: Model<CallLogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getCallLogs(ownerId: string) {
    const logs = await this.callLogModel
      .find({ owner: ownerId })
      .populate('peer', 'username displayName profilePicture')
      .sort({ startedAt: -1 })
      .limit(50)
      .lean()

    return { callLogs: logs.map((log) => this.serializeCallLog(log)) }
  }

  async createCallLog(ownerId: string, input: CreateCallLogInput) {
    this.assertObjectId(input.peerId, 'Peer user not found')

    if (ownerId === input.peerId) {
      throw new HttpException('Cannot create a call log with yourself.', HttpStatus.BAD_REQUEST)
    }

    const peer = await this.userModel.exists({ _id: input.peerId })
    if (!peer) {
      throw new HttpException('Peer user not found.', HttpStatus.NOT_FOUND)
    }

    const callLog = await this.callLogModel.create({
      owner: ownerId,
      peer: input.peerId,
      direction: input.direction,
      type: input.type,
      status: input.status || 'calling',
      startedAt: input.startedAt ? new Date(input.startedAt) : new Date(),
    })

    const populatedLog = await callLog.populate('peer', 'username displayName profilePicture')

    return { callLog: this.serializeCallLog(populatedLog.toObject()) }
  }

  async updateCallLog(ownerId: string, callLogId: string, input: UpdateCallLogInput) {
    this.assertObjectId(callLogId, 'Call log not found')

    const updateFields: Partial<CallLog> = {}
    if (input.status) updateFields.status = input.status
    if (input.endedAt) updateFields.endedAt = new Date(input.endedAt)
    if (typeof input.durationSeconds === 'number') {
      updateFields.durationSeconds = Math.max(0, Math.round(input.durationSeconds))
    }

    const callLog = await this.callLogModel
      .findOneAndUpdate({ _id: callLogId, owner: ownerId }, { $set: updateFields }, { new: true })
      .populate('peer', 'username displayName profilePicture')
      .lean()

    if (!callLog) {
      throw new HttpException('Call log not found.', HttpStatus.NOT_FOUND)
    }

    return { callLog: this.serializeCallLog(callLog) }
  }

  private assertObjectId(id: string, message: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(message, HttpStatus.NOT_FOUND)
    }
  }

  private serializeCallLog(log: any) {
    const peer = log.peer
    const peerId = peer?._id?.toString?.() || peer?.toString?.() || ''

    return {
      id: log._id.toString(),
      ownerId: log.owner.toString(),
      peerId,
      peer,
      direction: log.direction,
      type: log.type,
      status: log.status,
      startedAt: log.startedAt instanceof Date ? log.startedAt.toISOString() : log.startedAt,
      endedAt: log.endedAt instanceof Date ? log.endedAt.toISOString() : log.endedAt,
      durationSeconds: log.durationSeconds,
    }
  }
}
