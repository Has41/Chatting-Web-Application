import type { User } from "@shared/types"

export type CallLogDirection = "incoming" | "outgoing"
export type CallLogStatus = "calling" | "missed" | "declined" | "answered" | "ended" | "unavailable" | "failed"
export type CallLogType = "audio" | "video"

export interface CallLogEntry {
  id: string
  ownerId: string
  peerId: string
  direction: CallLogDirection
  type: CallLogType
  status: CallLogStatus
  startedAt: string
  endedAt?: string
  durationSeconds?: number
  peer?: User
}
