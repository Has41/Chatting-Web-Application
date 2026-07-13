import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { Camera, CameraOff, Mic, MicOff, Phone, PhoneOff, Volume2 } from "lucide-react"
import type { User } from "@shared/types"

interface AudioCallPanelProps {
  status: "idle" | "calling" | "ringing" | "active"
  callType: "audio" | "video"
  remoteStream: MediaStream | null
  localStream: MediaStream | null
  peer?: User | null
  error?: string
  isMuted?: boolean
  isCameraOff?: boolean
  onAccept: () => void
  onReject: () => void
  onEnd: () => void
  onToggleMute: () => void
  onToggleCamera: () => void
}

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
  const isCallLive = status === "active"
  const isRinging = status === "ringing"
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

type MuteState = "muted" | "unmuted"
type CameraState = "on" | "off"

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
          <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(145deg,_#0f172a,_#020617)] px-6 text-center">
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

interface AudioOnlyCallPanelProps {
  status: AudioCallPanelProps["status"]
  remoteStream: MediaStream | null
  peer?: User | null
  peerName: string
  statusText?: string
  callDuration: string
  error?: string
  muteState: MuteState
  onAccept: () => void
  onReject: () => void
  onEnd: () => void
  onToggleMute: () => void
}

const AudioOnlyCallPanel = ({
  status,
  remoteStream,
  peer,
  peerName,
  statusText,
  callDuration,
  error,
  muteState,
  onAccept,
  onReject,
  onEnd,
  onToggleMute
}: AudioOnlyCallPanelProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isCallLive = status === "active"
  const isRinging = status === "ringing"

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  return (
    <div className="absolute top-20 left-1/2 z-40 w-[21rem] max-w-[calc(100%-2rem)] -translate-x-1/2 overflow-hidden rounded-xl bg-slate-950 text-white shadow-xl">
      <audio ref={audioRef} autoPlay>
        <track kind="captions" label="Live captions unavailable" />
      </audio>

      <div className="relative px-5 pt-6 pb-4">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,_rgba(15,23,42,0.98),_rgba(2,6,23,1))]" />
        <div className="relative flex flex-col items-center text-center">
          <AvatarPulse peer={peer} peerName={peerName} isCallLive={isCallLive} size="normal" />

          <h3 className="mt-4 max-w-full truncate text-lg font-semibold">{peerName}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-white/75">
            {isCallLive ? <Volume2 className="size-4" /> : <Mic className="size-4" />}
            <span>{isCallLive ? callDuration : statusText}</span>
          </div>

          {isCallLive && (
            <div className="mt-4 flex h-6 items-end justify-center gap-1.5" aria-hidden="true">
              <span className="h-3 w-1 rounded-full bg-emerald-300/80 animate-pulse motion-reduce:animate-none" />
              <span className="h-5 w-1 rounded-full bg-emerald-300/90 animate-pulse [animation-delay:120ms] motion-reduce:animate-none" />
              <span className="h-4 w-1 rounded-full bg-emerald-300/80 animate-pulse [animation-delay:240ms] motion-reduce:animate-none" />
              <span className="h-6 w-1 rounded-full bg-emerald-300/90 animate-pulse [animation-delay:360ms] motion-reduce:animate-none" />
              <span className="h-3 w-1 rounded-full bg-emerald-300/80 animate-pulse [animation-delay:480ms] motion-reduce:animate-none" />
            </div>
          )}
        </div>
      </div>

      {error && status !== "idle" && <p className="px-5 pb-2 text-center text-xs text-red-200">{error}</p>}

      <AudioCallControls
        ringing={isRinging}
        live={isCallLive}
        muteState={muteState}
        onAccept={onAccept}
        onReject={onReject}
        onEnd={onEnd}
        onToggleMute={onToggleMute}
      />
    </div>
  )
}

const LocalVideoPreview = ({
  localStream,
  cameraState,
  videoRef
}: {
  localStream: MediaStream | null
  cameraState: CameraState
  videoRef: React.RefObject<HTMLVideoElement | null>
}) => (
  <div className="absolute right-4 bottom-4 h-32 w-24 overflow-hidden rounded-lg border border-white/15 bg-slate-900 shadow-xl sm:h-40 sm:w-30">
    {localStream && cameraState === "on" ? (
      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover">
        <track kind="captions" label="Local live captions unavailable" />
      </video>
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-slate-800 text-white/70">
        <CameraOff className="size-6" />
      </div>
    )}
  </div>
)

const VideoCallControls = ({
  ringing,
  live,
  muteState,
  cameraState,
  onAccept,
  onReject,
  onEnd,
  onToggleMute,
  onToggleCamera
}: {
  ringing: boolean
  live: boolean
  muteState: MuteState
  cameraState: CameraState
  onAccept: () => void
  onReject: () => void
  onEnd: () => void
  onToggleMute: () => void
  onToggleCamera: () => void
}) => (
  <div className="flex items-center justify-center gap-3 bg-zinc-950 px-5 py-4">
    {ringing && (
      <CallButton tone="accept" onClick={onAccept} label="Accept video call">
        <Phone className="size-5" />
      </CallButton>
    )}

    {live && (
      <>
        <MuteCallButton muteState={muteState} iconSize="size-5" onClick={onToggleMute} />
        <CameraCallButton cameraState={cameraState} onClick={onToggleCamera} />
      </>
    )}

    <CallButton tone="danger" onClick={ringing ? onReject : onEnd} label={ringing ? "Decline video call" : "End video call"}>
      <PhoneOff className="size-5" />
    </CallButton>
  </div>
)

const AudioCallControls = ({
  ringing,
  live,
  muteState,
  onAccept,
  onReject,
  onEnd,
  onToggleMute
}: {
  ringing: boolean
  live: boolean
  muteState: MuteState
  onAccept: () => void
  onReject: () => void
  onEnd: () => void
  onToggleMute: () => void
}) => (
  <div className="relative flex items-center justify-center gap-4 bg-black/30 px-5 py-5">
    {ringing && (
      <CallButton tone="accept" onClick={onAccept} label="Accept audio call">
        <Phone className="size-6" />
      </CallButton>
    )}

    {live && <MuteCallButton muteState={muteState} iconSize="size-6" onClick={onToggleMute} />}

    <CallButton tone="danger" onClick={ringing ? onReject : onEnd} label={ringing ? "Decline audio call" : "End audio call"}>
      <PhoneOff className="size-6" />
    </CallButton>
  </div>
)

const MuteCallButton = ({
  muteState,
  iconSize,
  onClick
}: {
  muteState: MuteState
  iconSize: string
  onClick: () => void
}) => {
  const muted = muteState === "muted"

  return (
    <CallButton tone={muted ? "light" : "ghost"} onClick={onClick} label={muted ? "Unmute microphone" : "Mute microphone"} pressed={muted}>
      {muted ? <MicOff className={iconSize} /> : <Mic className={iconSize} />}
    </CallButton>
  )
}

const CameraCallButton = ({ cameraState, onClick }: { cameraState: CameraState; onClick: () => void }) => {
  const cameraOff = cameraState === "off"

  return (
    <CallButton
      tone={cameraOff ? "light" : "ghost"}
      onClick={onClick}
      label={cameraOff ? "Turn camera on" : "Turn camera off"}
      pressed={cameraOff}
    >
      {cameraOff ? <CameraOff className="size-5" /> : <Camera className="size-5" />}
    </CallButton>
  )
}

const AvatarPulse = ({
  peer,
  peerName,
  isCallLive,
  size
}: {
  peer?: User | null
  peerName: string
  isCallLive: boolean
  size: "normal" | "large"
}) => {
  const avatarSize = size === "large" ? "size-28 text-4xl" : "size-24 text-3xl"

  return (
    <div className="relative">
      {!isCallLive && (
        <>
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20 motion-reduce:animate-none" />
          <span className="absolute -inset-3 rounded-full bg-emerald-300/10" />
        </>
      )}
      {peer?.profilePicture?.url ? (
        <img
          src={peer.profilePicture.url}
          alt=""
          className={`relative ${avatarSize} rounded-full border-4 border-white/15 object-cover shadow-xl`}
        />
      ) : (
        <div className={`relative flex ${avatarSize} items-center justify-center rounded-full border-4 border-white/15 bg-slate-700 font-semibold text-white shadow-xl`}>
          {peerName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

const CallButton = ({
  children,
  label,
  onClick,
  pressed,
  tone
}: {
  children: ReactNode
  label: string
  onClick: () => void
  pressed?: boolean
  tone: "accept" | "danger" | "ghost" | "light"
}) => {
  const toneClass =
    tone === "accept"
      ? "bg-emerald-500 text-white hover:bg-emerald-400 focus-visible:ring-emerald-200"
      : tone === "danger"
        ? "bg-red-500 text-white hover:bg-red-400 focus-visible:ring-red-200"
        : tone === "light"
          ? "bg-white text-slate-950 hover:bg-slate-100 focus-visible:ring-white/70"
          : "bg-white/12 text-white hover:bg-white/18 focus-visible:ring-white/70"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex size-12 items-center justify-center rounded-full shadow-md transition duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95 ${toneClass}`}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
    >
      {children}
    </button>
  )
}

export default AudioCallPanel
