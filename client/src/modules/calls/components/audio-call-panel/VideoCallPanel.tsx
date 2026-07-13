import { useEffect, useRef } from "react"
import type { User } from "@shared/types"
import AvatarPulse from "./AvatarPulse"
import { VideoCallControls } from "./CallControls"
import LocalVideoPreview from "./LocalVideoPreview"
import type { AudioCallPanelProps, CameraState, MuteState } from "./types"

interface VideoCallPanelProps {
  status: AudioCallPanelProps["status"]
  remoteStream: MediaStream | null
  localStream: MediaStream | null
  peer?: User | null
  peerName: string
  statusText?: string
  callDuration: string
  error?: string
  muteState: MuteState
  cameraState: CameraState
  onAccept: () => void
  onReject: () => void
  onEnd: () => void
  onToggleMute: () => void
  onToggleCamera: () => void
}

const VideoCallPanel = ({
  status,
  remoteStream,
  localStream,
  peer,
  peerName,
  statusText,
  callDuration,
  error,
  muteState,
  cameraState,
  onAccept,
  onReject,
  onEnd,
  onToggleMute,
  onToggleCamera
}: VideoCallPanelProps) => {
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const isCallLive = status === "active"
  const isRinging = status === "ringing"

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  return (
    <div className="absolute inset-x-4 top-20 z-40 overflow-hidden rounded-xl bg-zinc-950 text-white shadow-2xl">
      <div className="relative h-[min(65vh,34rem)] min-h-80 bg-black">
        {remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover">
            <track kind="captions" label="Live captions unavailable" />
          </video>
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(145deg,#0f172a,#020617)] px-6 text-center">
            <AvatarPulse peer={peer} peerName={peerName} isCallLive={isCallLive} size="large" />
            <h3 className="mt-5 max-w-full truncate text-xl font-semibold">{peerName}</h3>
            <p className="mt-2 text-sm text-white/70">{isCallLive ? callDuration : statusText}</p>
          </div>
        )}

        <div className="absolute top-4 left-4 max-w-[calc(100%-2rem)] rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white">
          {isCallLive ? callDuration : statusText}
        </div>

        <LocalVideoPreview localStream={localStream} cameraState={cameraState} videoRef={localVideoRef} />
      </div>

      {error && status !== "idle" && <p className="px-5 pt-3 text-center text-xs text-red-200">{error}</p>}

      <VideoCallControls
        ringing={isRinging}
        live={isCallLive}
        muteState={muteState}
        cameraState={cameraState}
        onAccept={onAccept}
        onReject={onReject}
        onEnd={onEnd}
        onToggleMute={onToggleMute}
        onToggleCamera={onToggleCamera}
      />
    </div>
  )
}

export default VideoCallPanel
