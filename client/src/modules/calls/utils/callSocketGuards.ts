import type { CallStatus, CallType, FinalCallStatus } from "@calls/types/callSocket"

export const isSupportedCallType = (type: string): type is CallType => type === "audio" || type === "video"

export const getLocalEndStatus = (status: CallStatus): FinalCallStatus => (status === "active" ? "ended" : "declined")

export const getRemoteEndStatus = (status: CallStatus): FinalCallStatus => (status === "ringing" ? "missed" : "ended")

export const getConnectionFailureStatus = (status: CallStatus): FinalCallStatus => (status === "active" ? "ended" : "failed")
