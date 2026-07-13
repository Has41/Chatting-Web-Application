import { Camera, CameraOff, Mic, MicOff, Phone, PhoneOff } from "lucide-react"
import type { CameraState, MuteState } from "./types"
import CallButton from "./CallButton"

interface VideoCallControlsProps {
  ringing: boolean
  live: boolean
  muteState: MuteState
  cameraState: CameraState
  onAccept: () => void
  onReject: () => void
  onEnd: () => void
  onToggleMute: () => void
  onToggleCamera: () => void
}

export const VideoCallControls = ({
  ringing,
  live,
  muteState,
  cameraState,
  onAccept,
  onReject,
  onEnd,
  onToggleMute,
  onToggleCamera
}: VideoCallControlsProps) => (
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

interface AudioCallControlsProps {
  ringing: boolean
  live: boolean
  muteState: MuteState
  onAccept: () => void
  onReject: () => void
  onEnd: () => void
  onToggleMute: () => void
}

export const AudioCallControls = ({
  ringing,
  live,
  muteState,
  onAccept,
  onReject,
  onEnd,
  onToggleMute
}: AudioCallControlsProps) => (
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
    <CallButton
      tone={muted ? "light" : "ghost"}
      onClick={onClick}
      label={muted ? "Unmute microphone" : "Mute microphone"}
      pressed={muted}
    >
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
