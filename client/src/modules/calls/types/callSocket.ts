export type CallStatus = "idle" | "calling" | "ringing" | "active"
export type CallType = "audio" | "video"
export type FinalCallStatus = "missed" | "declined" | "ended" | "unavailable" | "failed"

export interface IncomingCall {
  from: string
  type: CallType
  offer: RTCSessionDescriptionInit
}

export interface CallAcceptedPayload {
  from: string
  answer: RTCSessionDescriptionInit
}

export interface IceCandidatePayload {
  from: string
  candidate: RTCIceCandidateInit
}
