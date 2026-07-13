import type { CallStatus, CallType, IncomingCall } from "@calls/types/callSocket"

export interface CallSocketState {
  status: CallStatus
  incomingCall: IncomingCall | null
  remoteStream: MediaStream | null
  localStream: MediaStream | null
  callPeerId: string | null
  callType: CallType
  error: string
  isMuted: boolean
  isCameraOff: boolean
}

export type CallSocketAction =
  | { type: "callStarted"; peerId: string; callType: CallType }
  | { type: "incomingCallReceived"; incomingCall: IncomingCall }
  | { type: "callAccepted" }
  | { type: "callReset" }
  | { type: "callTypeSet"; callType: CallType }
  | { type: "peerSet"; peerId: string }
  | { type: "localStreamSet"; stream: MediaStream | null }
  | { type: "remoteStreamSet"; stream: MediaStream | null }
  | { type: "errorSet"; error: string }
  | { type: "errorCleared" }
  | { type: "muteSet"; isMuted: boolean }
  | { type: "cameraSet"; isCameraOff: boolean }

export const initialCallSocketState: CallSocketState = {
  status: "idle",
  incomingCall: null,
  remoteStream: null,
  localStream: null,
  callPeerId: null,
  callType: "audio",
  error: "",
  isMuted: false,
  isCameraOff: false
}

export const callSocketReducer = (state: CallSocketState, action: CallSocketAction): CallSocketState => {
  switch (action.type) {
    case "callStarted":
      return {
        ...state,
        status: "calling",
        callPeerId: action.peerId,
        callType: action.callType
      }
    case "incomingCallReceived":
      return {
        ...state,
        status: "ringing",
        incomingCall: action.incomingCall,
        callPeerId: action.incomingCall.from,
        callType: action.incomingCall.type
      }
    case "callAccepted":
      return {
        ...state,
        status: "active",
        incomingCall: null
      }
    case "callReset":
      return {
        ...initialCallSocketState,
        error: state.error
      }
    case "callTypeSet":
      return {
        ...state,
        callType: action.callType
      }
    case "peerSet":
      return {
        ...state,
        callPeerId: action.peerId
      }
    case "localStreamSet":
      return {
        ...state,
        localStream: action.stream
      }
    case "remoteStreamSet":
      return {
        ...state,
        remoteStream: action.stream
      }
    case "errorSet":
      return {
        ...state,
        error: action.error
      }
    case "errorCleared":
      return {
        ...state,
        error: ""
      }
    case "muteSet":
      return {
        ...state,
        isMuted: action.isMuted
      }
    case "cameraSet":
      return {
        ...state,
        isCameraOff: action.isCameraOff
      }
    default:
      return state
  }
}
