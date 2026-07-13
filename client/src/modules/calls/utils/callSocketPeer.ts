import { ICE_SERVERS } from "@calls/socket/constants/callSocket.constants"

export const createManagedPeerConnection = () => new RTCPeerConnection(ICE_SERVERS)

export const closeManagedPeerConnection = (peerConnection: RTCPeerConnection | null) => {
  if (!peerConnection) return

  peerConnection.onicecandidate = null
  peerConnection.ontrack = null
  peerConnection.onconnectionstatechange = null
  peerConnection.close()
}
