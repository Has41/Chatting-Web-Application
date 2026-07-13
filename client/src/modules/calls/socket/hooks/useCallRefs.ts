import { useMemo, useRef } from "react"
import type { Socket } from "socket.io-client"
import type { CallStatus, FinalCallStatus } from "@calls/types/callSocket"

export const useCallRefs = () => {
  const socketRef = useRef<Socket | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const activePeerIdRef = useRef<string | null>(null)
  const activeCallLogIdRef = useRef<string | null>(null)
  const activeCallStartedAtRef = useRef<string | null>(null)
  const pendingFinalCallStatusRef = useRef<FinalCallStatus | null>(null)
  const finalizedCallStatusRef = useRef<FinalCallStatus | null>(null)
  const statusRef = useRef<CallStatus>("idle")
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([])

  return useMemo(
    () => ({
      socketRef,
      peerConnectionRef,
      localStreamRef,
      activePeerIdRef,
      activeCallLogIdRef,
      activeCallStartedAtRef,
      pendingFinalCallStatusRef,
      finalizedCallStatusRef,
      statusRef,
      pendingCandidatesRef
    }),
    []
  )
}

export type CallRefs = ReturnType<typeof useCallRefs>
