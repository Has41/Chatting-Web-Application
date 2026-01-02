import { useEffect, useRef, useState, useCallback } from "react"
import { io } from "socket.io-client"

const useCallSocket = (userId) => {
  const socketRef = useRef(null)
  const peerRef = useRef(null)

  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)

  const [inCall, setInCall] = useState(false)
  const [incomingCall, setIncomingCall] = useState(null)

  useEffect(() => {
    if (!userId) return

    socketRef.current = io(import.meta.env.VITE_API_BASE_URL, {
      query: { userId }
    })

    socketRef.current.on("connect", () => {
      console.log("Call socket connected:", socketRef.current.id)
    })

    socketRef.current.on("incoming-call", handleIncomingCall)
    socketRef.current.on("call-accepted", handleCallAccepted)
    socketRef.current.on("call-rejected", handleCallRejected)
    socketRef.current.on("end-call", handleCallEnded)
    socketRef.current.on("ice-candidate", handleRemoteIce)

    return () => {
      socketRef.current.disconnect()
    }
  }, [userId])

  const startCall = useCallback(
    async (calleeId, isVideo = false) => {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true
      })

      initPeerConnection(calleeId)

      localStreamRef.current.getTracks().forEach((track) => peerRef.current.addTrack(track, localStreamRef.current))

      const offer = await peerRef.current.createOffer()
      await peerRef.current.setLocalDescription(offer)

      socketRef.current.emit("call-user", {
        from: userId,
        to: calleeId,
        type: isVideo ? "video" : "audio",
        offer
      })

      setInCall(true)
    },
    [userId]
  )

  const acceptCall = useCallback(
    async (callerId, isVideo, offer) => {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true
      })

      initPeerConnection(callerId)

      localStreamRef.current.getTracks().forEach((track) => peerRef.current.addTrack(track, localStreamRef.current))

      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer))

      const answer = await peerRef.current.createAnswer()
      await peerRef.current.setLocalDescription(answer)

      socketRef.current.emit("answer-call", {
        from: userId,
        to: callerId,
        answer
      })

      setInCall(true)
      setIncomingCall(null)
    },
    [userId]
  )

  const rejectCall = useCallback(
    (callerId) => {
      socketRef.current.emit("reject-call", { from: userId, to: callerId })
      setIncomingCall(null)
    },
    [userId]
  )

  const endCall = useCallback(
    (otherUserId) => {
      socketRef.current.emit("end-call", { from: userId, to: otherUserId })
      cleanup()
    },
    [userId]
  )

  const initPeerConnection = (otherUserId) => {
    peerRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    })

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          from: userId,
          to: otherUserId,
          candidate: event.candidate
        })
      }
    }

    peerRef.current.ontrack = (event) => {
      remoteStreamRef.current = event.streams[0]
    }
  }

  const handleIncomingCall = ({ from, type, offer }) => {
    setIncomingCall({ from, isVideo: type === "video", offer })
  }

  const handleCallAccepted = ({ answer }) => {
    console.log("✅ Call accepted")
    peerRef.current.setRemoteDescription(new RTCSessionDescription(answer))
  }

  const handleCallRejected = () => {
    console.log("❌ Call rejected")
    cleanup()
  }

  const handleCallEnded = () => {
    console.log("🔚 Call ended")
    cleanup()
  }

  const handleRemoteIce = async ({ candidate }) => {
    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (err) {
      console.error("Error adding ICE candidate", err)
    }
  }

  const cleanup = () => {
    setInCall(false)
    setIncomingCall(null)

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (peerRef.current) {
      peerRef.current.close()
    }
    localStreamRef.current = null
    remoteStreamRef.current = null
    peerRef.current = null
  }

  return {
    inCall,
    incomingCall,
    localStreamRef,
    remoteStreamRef,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    cleanup
  }
}

export default useCallSocket
