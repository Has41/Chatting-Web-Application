import { useCallback, useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { createCallLog, finishCallLog, updateCallLog } from "@calls/api/callLogsApi"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
}

type CallStatus = "idle" | "calling" | "ringing" | "active"
type CallType = "audio" | "video"
type FinalCallStatus = "missed" | "declined" | "ended" | "unavailable" | "failed"

interface IncomingCall {
  from: string
  type: CallType
  offer: RTCSessionDescriptionInit
}

export const useCallSocket = (userId: string | undefined) => {
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

  const [status, setStatus] = useState<CallStatus>("idle")
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [callPeerId, setCallPeerId] = useState<string | null>(null)
  const [callType, setCallType] = useState<CallType>("audio")
  const [error, setError] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    if (!error) return

    const timeoutId = window.setTimeout(() => setError(""), 3000)
    return () => window.clearTimeout(timeoutId)
  }, [error])

  const resetCall = useCallback(() => {
    peerConnectionRef.current?.close()
    peerConnectionRef.current = null
    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    localStreamRef.current = null
    activePeerIdRef.current = null
    activeCallLogIdRef.current = null
    activeCallStartedAtRef.current = null
    pendingCandidatesRef.current = []
    setIncomingCall(null)
    setRemoteStream(null)
    setLocalStream(null)
    setCallPeerId(null)
    setCallType("audio")
    setIsMuted(false)
    setIsCameraOff(false)
    setStatus("idle")
  }, [])

  const rememberCallLog = useCallback(
    (callLog: Awaited<ReturnType<typeof createCallLog>>) => {
      if (!callLog) return

      const pendingFinalStatus = pendingFinalCallStatusRef.current
      activeCallLogIdRef.current = callLog.id
      activeCallStartedAtRef.current = callLog.startedAt

      if (pendingFinalStatus) {
        pendingFinalCallStatusRef.current = null
        finishCallLog(userId, callLog.id, pendingFinalStatus, callLog.startedAt)
      }
    },
    [userId]
  )

  const finishActiveCallLog = useCallback(
    (status: FinalCallStatus) => {
      if (finalizedCallStatusRef.current) return

      finalizedCallStatusRef.current = status

      if (activeCallLogIdRef.current) {
        finishCallLog(userId, activeCallLogIdRef.current, status, activeCallStartedAtRef.current)
        return
      }

      pendingFinalCallStatusRef.current = status
    },
    [userId]
  )

  const sendIceCandidate = useCallback(
    (to: string, candidate: RTCIceCandidateInit) => {
      socketRef.current?.emit("ice-candidate", { from: userId, to, candidate })
    },
    [userId]
  )

  const createPeerConnection = useCallback(
    (peerId: string) => {
      const peerConnection = new RTCPeerConnection(ICE_SERVERS)

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendIceCandidate(peerId, event.candidate.toJSON())
        }
      }

      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0])
      }

      peerConnection.onconnectionstatechange = () => {
        if (peerConnectionRef.current !== peerConnection) return

        if (["failed", "closed", "disconnected"].includes(peerConnection.connectionState)) {
          finishActiveCallLog(statusRef.current === "active" ? "ended" : "failed")
          resetCall()
        }
      }

      peerConnectionRef.current = peerConnection
      activePeerIdRef.current = peerId
      setCallPeerId(peerId)

      return peerConnection
    },
    [finishActiveCallLog, resetCall, sendIceCandidate]
  )

  const addPendingCandidates = useCallback(async () => {
    const peerConnection = peerConnectionRef.current
    if (!peerConnection?.remoteDescription) return

    const candidates = pendingCandidatesRef.current
    pendingCandidatesRef.current = []

    await Promise.all(
      candidates.map((candidate) =>
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((candidateError) => {
          console.error("Failed to add queued ICE candidate:", candidateError)
        })
      )
    )
  }, [])

  const getLocalMediaStream = useCallback(async (type: CallType) => {
    if (localStreamRef.current) return localStreamRef.current

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === "video" ? { facingMode: "user" } : false
    })
    localStreamRef.current = stream
    setLocalStream(stream)
    return stream
  }, [])

  const startCall = useCallback(
    async (to: string, type: CallType) => {
      if (!userId || !to || status !== "idle") return

      try {
        pendingFinalCallStatusRef.current = null
        finalizedCallStatusRef.current = null
        setError("")
        setCallType(type)
        const stream = await getLocalMediaStream(type)
        const peerConnection = createPeerConnection(to)
        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)

        setStatus("calling")
        socketRef.current?.emit("call-user", { from: userId, to, type, offer })
        createCallLog({ ownerId: userId, peerId: to, direction: "outgoing", type }).then(rememberCallLog)
      } catch (callError) {
        console.error(`Unable to start ${type} call:`, callError)
        setError(type === "video" ? "Camera or microphone access failed." : "Microphone access failed.")
        resetCall()
      }
    },
    [createPeerConnection, getLocalMediaStream, rememberCallLog, resetCall, status, userId]
  )

  const startAudioCall = useCallback((to: string) => startCall(to, "audio"), [startCall])
  const startVideoCall = useCallback((to: string) => startCall(to, "video"), [startCall])

  const acceptCall = useCallback(async () => {
    if (!userId || !incomingCall) return

    try {
      setError("")
      setCallType(incomingCall.type)
      const stream = await getLocalMediaStream(incomingCall.type)
      const peerConnection = createPeerConnection(incomingCall.from)
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

      await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingCall.offer))
      await addPendingCandidates()

      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      socketRef.current?.emit("answer-call", { from: userId, to: incomingCall.from, answer })
      pendingFinalCallStatusRef.current = null
      updateCallLog(userId, activeCallLogIdRef.current, { status: "answered" })
      setIncomingCall(null)
      setStatus("active")
    } catch (callError) {
      console.error(`Unable to accept ${incomingCall.type} call:`, callError)
      setError("Could not answer the call.")
      socketRef.current?.emit("reject-call", { from: userId, to: incomingCall.from })
      resetCall()
    }
  }, [addPendingCandidates, createPeerConnection, getLocalMediaStream, incomingCall, resetCall, userId])

  const rejectCall = useCallback(() => {
    if (!userId || !incomingCall) return
    socketRef.current?.emit("reject-call", { from: userId, to: incomingCall.from })
    finishActiveCallLog("declined")
    resetCall()
  }, [finishActiveCallLog, incomingCall, resetCall, userId])

  const endCall = useCallback(() => {
    const peerId = activePeerIdRef.current || callPeerId || incomingCall?.from
    if (userId && peerId) {
      socketRef.current?.emit("end-call", { from: userId, to: peerId })
    }
    finishActiveCallLog(statusRef.current === "active" ? "ended" : "declined")
    resetCall()
  }, [callPeerId, finishActiveCallLog, incomingCall?.from, resetCall, userId])

  const toggleMute = useCallback(() => {
    const audioTracks = localStreamRef.current?.getAudioTracks() || []
    const shouldMute = !isMuted

    audioTracks.forEach((track) => {
      track.enabled = !shouldMute
    })
    setIsMuted(shouldMute)
  }, [isMuted])

  const toggleCamera = useCallback(() => {
    const videoTracks = localStreamRef.current?.getVideoTracks() || []
    const shouldTurnOff = !isCameraOff

    videoTracks.forEach((track) => {
      track.enabled = !shouldTurnOff
    })
    setIsCameraOff(shouldTurnOff)
  }, [isCameraOff])

  useEffect(() => {
    if (!userId) return

    socketRef.current = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"]
    })

    socketRef.current.on("incoming-call", async (call: IncomingCall) => {
      if (!["audio", "video"].includes(call.type)) return
      if (activePeerIdRef.current || statusRef.current !== "idle") {
        socketRef.current?.emit("reject-call", { from: userId, to: call.from })
        return
      }

      finalizedCallStatusRef.current = null
      pendingFinalCallStatusRef.current = null
      activePeerIdRef.current = call.from
      setCallPeerId(call.from)
      setCallType(call.type)
      setIncomingCall(call)
      setStatus("ringing")
      createCallLog({ ownerId: userId, peerId: call.from, direction: "incoming", type: call.type, status: "missed" }).then(rememberCallLog)
    })

    socketRef.current.on("call-accepted", async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
      if (from !== activePeerIdRef.current || !peerConnectionRef.current) return

      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer))
      await addPendingCandidates()
      pendingFinalCallStatusRef.current = null
      updateCallLog(userId, activeCallLogIdRef.current, { status: "answered" })
      setStatus("active")
    })

    socketRef.current.on("call-rejected", () => {
      setError("Call declined.")
      finishActiveCallLog("declined")
      resetCall()
    })

    socketRef.current.on("call-unavailable", () => {
      setError("User is not available.")
      finishActiveCallLog("unavailable")
      resetCall()
    })

    socketRef.current.on("ice-candidate", async ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
      if (from !== activePeerIdRef.current || !candidate) return

      if (!peerConnectionRef.current?.remoteDescription) {
        pendingCandidatesRef.current.push(candidate)
        return
      }

      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch((candidateError) => {
        console.error("Failed to add ICE candidate:", candidateError)
      })
    })

    socketRef.current.on("end-call", () => {
      finishActiveCallLog(statusRef.current === "ringing" ? "missed" : "ended")
      resetCall()
    })

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
      resetCall()
    }
  }, [addPendingCandidates, finishActiveCallLog, rememberCallLog, resetCall, userId])

  return {
    status,
    incomingCall,
    remoteStream,
    localStream,
    callPeerId,
    callType,
    error,
    isMuted,
    isCameraOff,
    startAudioCall,
    startVideoCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleCamera
  }
}

export default useCallSocket
