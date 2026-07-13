import { useCallback, useEffect, useReducer } from "react"
import { createCallLog, updateCallLog } from "@calls/api/callLogsApi"
import { callSocketReducer, initialCallSocketState } from "@calls/state/callSocketState"
import type { CallType } from "@calls/types/callSocket"
import { getConnectionFailureStatus, getLocalEndStatus } from "@calls/utils/callSocketGuards"
import { setAudioTracksEnabled, setVideoTracksEnabled } from "@calls/utils/callSocketMedia"
import { useCallLogLifecycle } from "./hooks/useCallLogLifecycle"
import { useCallRefs } from "./hooks/useCallRefs"
import { useCallSocketEvents } from "./hooks/useCallSocketEvents"
import { usePeerConnection } from "./hooks/usePeerConnection"

export const useCallSocket = (userId: string | undefined) => {
  const refs = useCallRefs()
  const [state, dispatch] = useReducer(callSocketReducer, initialCallSocketState)
  const { status, incomingCall, remoteStream, localStream, callPeerId, callType, error, isMuted, isCameraOff } = state

  useEffect(() => {
    refs.setStatus(status)
  }, [refs, status])

  useEffect(() => {
    if (!error) return

    const timeoutId = window.setTimeout(() => dispatch({ type: "errorCleared" }), 3000)
    return () => window.clearTimeout(timeoutId)
  }, [error])

  const { rememberCallLog, finishActiveCallLog } = useCallLogLifecycle(userId, refs)

  const sendIceCandidate = useCallback(
    (to: string, candidate: RTCIceCandidateInit) => {
      refs.socketRef.current?.emit("ice-candidate", { from: userId, to, candidate })
    },
    [refs, userId]
  )

  const { closePeerConnection, stopLocalStream, createPeerConnection, addPendingCandidates, getLocalMediaStream } =
    usePeerConnection({
      refs,
      dispatch,
      sendIceCandidate
    })

  const resetCall = useCallback(() => {
    closePeerConnection()
    stopLocalStream()
    refs.resetCallRefs()
    dispatch({ type: "callReset" })
  }, [closePeerConnection, refs, stopLocalStream])

  const handleConnectionFailure = useCallback(() => {
    finishActiveCallLog(getConnectionFailureStatus(refs.statusRef.current))
    resetCall()
  }, [finishActiveCallLog, refs, resetCall])

  useEffect(() => {
    return () => {
      closePeerConnection()
    }
  }, [closePeerConnection])

  const startCall = useCallback(
    async (to: string, type: CallType) => {
      if (!userId || !to || status !== "idle") return

      try {
        refs.clearCallFinalization()
        dispatch({ type: "errorCleared" })
        dispatch({ type: "callTypeSet", callType: type })
        const stream = await getLocalMediaStream(type)
        const peerConnection = createPeerConnection(to, handleConnectionFailure)
        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)

        dispatch({ type: "callStarted", peerId: to, callType: type })
        refs.socketRef.current?.emit("call-user", { from: userId, to, type, offer })
        createCallLog({ ownerId: userId, peerId: to, direction: "outgoing", type }).then(rememberCallLog)
      } catch (callError) {
        console.error(`Unable to start ${type} call:`, callError)
        dispatch({
          type: "errorSet",
          error: type === "video" ? "Camera or microphone access failed." : "Microphone access failed."
        })
        resetCall()
      }
    },
    [createPeerConnection, getLocalMediaStream, handleConnectionFailure, refs, rememberCallLog, resetCall, status, userId]
  )

  const startAudioCall = useCallback((to: string) => startCall(to, "audio"), [startCall])
  const startVideoCall = useCallback((to: string) => startCall(to, "video"), [startCall])

  const acceptCall = useCallback(async () => {
    if (!userId || !incomingCall) return

    try {
      dispatch({ type: "errorCleared" })
      dispatch({ type: "callTypeSet", callType: incomingCall.type })
      const stream = await getLocalMediaStream(incomingCall.type)
      const peerConnection = createPeerConnection(incomingCall.from, handleConnectionFailure)
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

      await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingCall.offer))
      await addPendingCandidates()

      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      refs.socketRef.current?.emit("answer-call", { from: userId, to: incomingCall.from, answer })
      refs.setPendingFinalCallStatus(null)
      updateCallLog(userId, refs.activeCallLogIdRef.current, { status: "answered" })
      dispatch({ type: "callAccepted" })
    } catch (callError) {
      console.error(`Unable to accept ${incomingCall.type} call:`, callError)
      dispatch({ type: "errorSet", error: "Could not answer the call." })
      refs.socketRef.current?.emit("reject-call", { from: userId, to: incomingCall.from })
      resetCall()
    }
  }, [
    addPendingCandidates,
    createPeerConnection,
    getLocalMediaStream,
    handleConnectionFailure,
    incomingCall,
    refs,
    resetCall,
    userId
  ])

  const rejectCall = useCallback(() => {
    if (!userId || !incomingCall) return
    refs.socketRef.current?.emit("reject-call", { from: userId, to: incomingCall.from })
    finishActiveCallLog("declined")
    resetCall()
  }, [finishActiveCallLog, incomingCall, refs, resetCall, userId])

  const endCall = useCallback(() => {
    const peerId = refs.activePeerIdRef.current || callPeerId || incomingCall?.from
    if (userId && peerId) {
      refs.socketRef.current?.emit("end-call", { from: userId, to: peerId })
    }
    finishActiveCallLog(getLocalEndStatus(refs.statusRef.current))
    resetCall()
  }, [callPeerId, finishActiveCallLog, incomingCall?.from, refs, resetCall, userId])

  const toggleMute = useCallback(() => {
    const shouldMute = !isMuted

    setAudioTracksEnabled(refs.localStreamRef.current, !shouldMute)
    dispatch({ type: "muteSet", isMuted: shouldMute })
  }, [isMuted, refs])

  const toggleCamera = useCallback(() => {
    const shouldTurnOff = !isCameraOff

    setVideoTracksEnabled(refs.localStreamRef.current, !shouldTurnOff)
    dispatch({ type: "cameraSet", isCameraOff: shouldTurnOff })
  }, [isCameraOff, refs])

  useCallSocketEvents({
    userId,
    refs,
    dispatch,
    addPendingCandidates,
    finishActiveCallLog,
    rememberCallLog,
    resetCall
  })

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
