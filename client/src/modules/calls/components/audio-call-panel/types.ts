import type { User } from "@shared/types"

export type CallPanelStatus = "idle" | "calling" | "ringing" | "active"
export type CallPanelType = "audio" | "video"
export type MuteState = "muted" | "unmuted"
export type CameraState = "on" | "off"

export interface AudioCallPanelProps {
  status: CallPanelStatus
  callType: CallPanelType
  remoteStream: MediaStream | null
  localStream: MediaStream | null
  peer?: User | null
  error?: string
  isMuted?: boolean
  isCameraOff?: boolean
  onAccept: () => void
  onReject: () => void
  onEnd: () => void
  onToggleMute: () => void
  onToggleCamera: () => void
}
