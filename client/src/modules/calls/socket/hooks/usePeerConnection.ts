import { useCallback } from "react"
import type { CallSocketAction } from "@calls/state/callSocketState"
import type { CallType } from "@calls/types/callSocket"
import { createLocalMediaConstraints, stopMediaStream } from "@calls/utils/callSocketMedia"
import { closeManagedPeerConnection, createManagedPeerConnection } from "@calls/utils/callSocketPeer"
import type { CallRefs } from "./useCallRefs"

interface UsePeerConnectionOptions {
  refs: CallRefs
  dispatch: React.Dispatch<CallSocketAction>
  sendIceCandidate: (to: string, candidate: RTCIceCandidateInit) => void
}

export const usePeerConnection = ({ refs, dispatch, sendIceCandidate }: UsePeerConnectionOptions) => {
  const closePeerConnection = useCallback(() => {
    closeManagedPeerConnection(refs.peerConnectionRef.current)
    refs.setPeerConnection(null)
  }, [refs])

  const stopLocalStream = useCallback(() => {
    stopMediaStream(refs.localStreamRef.current)
    refs.setLocalStream(null)
  }, [refs])

  const createPeerConnection = useCallback(
    (peerId: string, onConnectionFailed: () => void) => {
      closePeerConnection()
      const peerConnection = createManagedPeerConnection()

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendIceCandidate(peerId, event.candidate.toJSON())
        }
      }

      peerConnection.ontrack = (event) => {
        dispatch({ type: "remoteStreamSet", stream: event.streams[0] })
      }

      peerConnection.onconnectionstatechange = () => {
        if (refs.peerConnectionRef.current !== peerConnection) return

        if (["failed", "closed", "disconnected"].includes(peerConnection.connectionState)) {
          onConnectionFailed()
        }
      }

      refs.setPeerConnection(peerConnection)
      refs.setActivePeerId(peerId)
      dispatch({ type: "peerSet", peerId })

      return peerConnection
    },
    [closePeerConnection, dispatch, refs, sendIceCandidate]
  )

  const addPendingCandidates = useCallback(async () => {
    const peerConnection = refs.peerConnectionRef.current
    if (!peerConnection?.remoteDescription) return

    const candidates = refs.takePendingCandidates()

    await Promise.all(
      candidates.map((candidate) =>
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((candidateError) => {
          console.error("Failed to add queued ICE candidate:", candidateError)
        })
      )
    )
  }, [refs])

  const getLocalMediaStream = useCallback(
    async (type: CallType) => {
      if (refs.localStreamRef.current) return refs.localStreamRef.current

      const stream = await navigator.mediaDevices.getUserMedia(createLocalMediaConstraints(type))
      refs.setLocalStream(stream)
      dispatch({ type: "localStreamSet", stream })
      return stream
    },
    [dispatch, refs]
  )

  return {
    closePeerConnection,
    stopLocalStream,
    createPeerConnection,
    addPendingCandidates,
    getLocalMediaStream
  }
}
