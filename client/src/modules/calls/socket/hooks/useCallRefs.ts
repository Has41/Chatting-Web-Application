import { useCallback, useMemo, useRef } from "react"
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

  const setSocket = useCallback((socket: Socket | null) => {
    socketRef.current = socket
  }, [])

  const clearSocket = useCallback((socket: Socket) => {
    if (socketRef.current === socket) {
      socketRef.current = null
    }
  }, [])

  const setStatus = useCallback((status: CallStatus) => {
    statusRef.current = status
  }, [])

  const setPeerConnection = useCallback((peerConnection: RTCPeerConnection | null) => {
    peerConnectionRef.current = peerConnection
  }, [])

  const setLocalStream = useCallback((stream: MediaStream | null) => {
    localStreamRef.current = stream
  }, [])

  const setActivePeerId = useCallback((peerId: string | null) => {
    activePeerIdRef.current = peerId
  }, [])

  const setActiveCallLog = useCallback((callLogId: string, startedAt: string) => {
    activeCallLogIdRef.current = callLogId
    activeCallStartedAtRef.current = startedAt
  }, [])

  const setPendingFinalCallStatus = useCallback((status: FinalCallStatus | null) => {
    pendingFinalCallStatusRef.current = status
  }, [])

  const setFinalizedCallStatus = useCallback((status: FinalCallStatus | null) => {
    finalizedCallStatusRef.current = status
  }, [])

  const clearCallFinalization = useCallback(() => {
    pendingFinalCallStatusRef.current = null
    finalizedCallStatusRef.current = null
  }, [])

  const addPendingCandidate = useCallback((candidate: RTCIceCandidateInit) => {
    pendingCandidatesRef.current.push(candidate)
  }, [])

  const takePendingCandidates = useCallback(() => {
    const candidates = pendingCandidatesRef.current
    pendingCandidatesRef.current = []
    return candidates
  }, [])

  const resetCallRefs = useCallback(() => {
    activePeerIdRef.current = null
    activeCallLogIdRef.current = null
    activeCallStartedAtRef.current = null
    pendingCandidatesRef.current = []
  }, [])

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
      pendingCandidatesRef,
      setSocket,
      clearSocket,
      setStatus,
      setPeerConnection,
      setLocalStream,
      setActivePeerId,
      setActiveCallLog,
      setPendingFinalCallStatus,
      setFinalizedCallStatus,
      clearCallFinalization,
      addPendingCandidate,
      takePendingCandidates,
      resetCallRefs
    }),
    [
      addPendingCandidate,
      clearCallFinalization,
      clearSocket,
      resetCallRefs,
      setActiveCallLog,
      setActivePeerId,
      setFinalizedCallStatus,
      setLocalStream,
      setPeerConnection,
      setPendingFinalCallStatus,
      setSocket,
      setStatus,
      takePendingCandidates
    ]
  )
}

export type CallRefs = ReturnType<typeof useCallRefs>
