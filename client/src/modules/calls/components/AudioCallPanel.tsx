import { useEffect, useMemo, useState } from "react"
import AudioOnlyCallPanel from "./audio-call-panel/AudioOnlyCallPanel"
import VideoCallPanel from "./audio-call-panel/VideoCallPanel"
import type { AudioCallPanelProps, CameraState, MuteState } from "./audio-call-panel/types"

const AudioCallPanel = ({
  status,
  callType,
  remoteStream,
  localStream,
  peer,
  error,
  isMuted = false,
  isCameraOff = false,
  onAccept,
  onReject,
  onEnd,
  onToggleMute,
  onToggleCamera
}: AudioCallPanelProps) => {
  const [timerState, setTimerState] = useState({ status, elapsedSeconds: 0 })
  const isVisible = status !== "idle" || !!error
  const peerName = peer?.displayName || peer?.username || "User"
  const muteState: MuteState = isMuted ? "muted" : "unmuted"
  const cameraState: CameraState = isCameraOff ? "off" : "on"

  if (timerState.status !== status) {
    setTimerState({ status, elapsedSeconds: 0 })
  }

  useEffect(() => {
    if (status !== "active") return
    const intervalId = window.setInterval(
      () => setTimerState((current) => ({ ...current, elapsedSeconds: current.elapsedSeconds + 1 })),
      1000
    )
    return () => window.clearInterval(intervalId)
  }, [status])

  const callDuration = useMemo(() => {
    const minutes = Math.floor(timerState.elapsedSeconds / 60)
    const seconds = timerState.elapsedSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }, [timerState.elapsedSeconds])

  if (!isVisible) return null

  const statusText =
    status === "calling"
      ? `Calling ${peerName}...`
      : status === "ringing"
        ? `Incoming ${callType} call`
        : status === "active"
          ? `${callType === "video" ? "Video" : "Audio"} call active`
          : error

  if (status === "idle" && error) {
    return (
      <div className="absolute top-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
        {error}
      </div>
    )
  }

  if (callType === "video") {
    return (
      <VideoCallPanel
        status={status}
        remoteStream={remoteStream}
        localStream={localStream}
        peer={peer}
        peerName={peerName}
        statusText={statusText}
        callDuration={callDuration}
        error={error}
        muteState={muteState}
        cameraState={cameraState}
        onAccept={onAccept}
        onReject={onReject}
        onEnd={onEnd}
        onToggleMute={onToggleMute}
        onToggleCamera={onToggleCamera}
      />
    )
  }

  return (
    <AudioOnlyCallPanel
      status={status}
      remoteStream={remoteStream}
      peer={peer}
      peerName={peerName}
      statusText={statusText}
      callDuration={callDuration}
      error={error}
      muteState={muteState}
      onAccept={onAccept}
      onReject={onReject}
      onEnd={onEnd}
      onToggleMute={onToggleMute}
    />
  )
}

export default AudioCallPanel
