import { useEffect } from "react"
import { io } from "socket.io-client"
import { createCallLog, updateCallLog } from "@calls/api/callLogsApi"
import type { CallAcceptedPayload, IceCandidatePayload, IncomingCall } from "@calls/types/callSocket"
import type { CallSocketAction } from "@calls/state/callSocketState"
import { SOCKET_URL } from "@calls/socket/constants/callSocket.constants"
import { getRemoteEndStatus, isSupportedCallType } from "@calls/utils/callSocketGuards"
import type { CallRefs } from "./useCallRefs"

interface UseCallSocketEventsOptions {
  userId: string | undefined
  refs: CallRefs
  dispatch: React.Dispatch<CallSocketAction>
  addPendingCandidates: () => Promise<void>
  finishActiveCallLog: (status: "missed" | "declined" | "ended" | "unavailable" | "failed") => void
  rememberCallLog: (callLog: Awaited<ReturnType<typeof createCallLog>>) => void
  resetCall: () => void
}

export const useCallSocketEvents = ({
  userId,
  refs,
  dispatch,
  addPendingCandidates,
  finishActiveCallLog,
  rememberCallLog,
  resetCall
}: UseCallSocketEventsOptions) => {
  useEffect(() => {
    if (!userId) return

    const socket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"]
    })
    refs.setSocket(socket)

    const handleIncomingCall = async (call: IncomingCall) => {
      if (!isSupportedCallType(call.type)) return
      if (refs.activePeerIdRef.current || refs.statusRef.current !== "idle") {
        refs.socketRef.current?.emit("reject-call", { from: userId, to: call.from })
        return
      }

      refs.clearCallFinalization()
      refs.setActivePeerId(call.from)
      dispatch({ type: "incomingCallReceived", incomingCall: call })
      createCallLog({ ownerId: userId, peerId: call.from, direction: "incoming", type: call.type, status: "missed" }).then(
        rememberCallLog
      )
    }

    const handleCallAccepted = async ({ from, answer }: CallAcceptedPayload) => {
      if (from !== refs.activePeerIdRef.current || !refs.peerConnectionRef.current) return

      await refs.peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer))
      await addPendingCandidates()
      refs.setPendingFinalCallStatus(null)
      updateCallLog(userId, refs.activeCallLogIdRef.current, { status: "answered" })
      dispatch({ type: "callAccepted" })
    }

    const handleCallRejected = () => {
      dispatch({ type: "errorSet", error: "Call declined." })
      finishActiveCallLog("declined")
      resetCall()
    }

    const handleCallUnavailable = () => {
      dispatch({ type: "errorSet", error: "User is not available." })
      finishActiveCallLog("unavailable")
      resetCall()
    }

    const handleIceCandidate = async ({ from, candidate }: IceCandidatePayload) => {
      if (from !== refs.activePeerIdRef.current || !candidate) return

      if (!refs.peerConnectionRef.current?.remoteDescription) {
        refs.addPendingCandidate(candidate)
        return
      }

      await refs.peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch((candidateError) => {
        console.error("Failed to add ICE candidate:", candidateError)
      })
    }

    const handleEndCall = () => {
      finishActiveCallLog(getRemoteEndStatus(refs.statusRef.current))
      resetCall()
    }

    socket.on("incoming-call", handleIncomingCall)
    socket.on("call-accepted", handleCallAccepted)
    socket.on("call-rejected", handleCallRejected)
    socket.on("call-unavailable", handleCallUnavailable)
    socket.on("ice-candidate", handleIceCandidate)
    socket.on("end-call", handleEndCall)

    return () => {
      socket.off("incoming-call", handleIncomingCall)
      socket.off("call-accepted", handleCallAccepted)
      socket.off("call-rejected", handleCallRejected)
      socket.off("call-unavailable", handleCallUnavailable)
      socket.off("ice-candidate", handleIceCandidate)
      socket.off("end-call", handleEndCall)
      socket.disconnect()
      refs.clearSocket(socket)
      resetCall()
    }
  }, [addPendingCandidates, dispatch, finishActiveCallLog, refs, rememberCallLog, resetCall, userId])
}
