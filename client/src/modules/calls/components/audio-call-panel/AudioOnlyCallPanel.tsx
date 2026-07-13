import { useEffect, useRef } from "react"
import { Mic, Volume2 } from "lucide-react"
import type { User } from "@shared/types"
import AvatarPulse from "./AvatarPulse"
import { AudioCallControls } from "./CallControls"
import type { AudioCallPanelProps, MuteState } from "./types"

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
    <div className="absolute top-20 left-1/2 z-40 w-84 max-w-[calc(100%-2rem)] -translate-x-1/2 overflow-hidden rounded-xl bg-slate-950 text-white shadow-xl">
      <audio ref={audioRef} autoPlay>
        <track kind="captions" label="Live captions unavailable" />
      </audio>

      <div className="relative px-5 pt-6 pb-4">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(15,23,42,0.98),rgba(2,6,23,1))]" />
        <div className="relative flex flex-col items-center text-center">
          <AvatarPulse peer={peer} peerName={peerName} isCallLive={isCallLive} size="normal" />

          <h3 className="mt-4 max-w-full truncate text-lg font-semibold">{peerName}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-white/75">
            {isCallLive ? <Volume2 className="size-4" /> : <Mic className="size-4" />}
            <span>{isCallLive ? callDuration : statusText}</span>
          </div>

          {isCallLive && (
            <div className="mt-4 flex h-6 items-end justify-center gap-1.5" aria-hidden="true">
              <span className="h-3 w-1 animate-pulse rounded-full bg-emerald-300/80 motion-reduce:animate-none" />
              <span className="h-5 w-1 animate-pulse rounded-full bg-emerald-300/90 [animation-delay:120ms] motion-reduce:animate-none" />
              <span className="h-4 w-1 animate-pulse rounded-full bg-emerald-300/80 [animation-delay:240ms] motion-reduce:animate-none" />
              <span className="h-6 w-1 animate-pulse rounded-full bg-emerald-300/90 [animation-delay:360ms] motion-reduce:animate-none" />
              <span className="h-3 w-1 animate-pulse rounded-full bg-emerald-300/80 [animation-delay:480ms] motion-reduce:animate-none" />
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

export default AudioOnlyCallPanel
