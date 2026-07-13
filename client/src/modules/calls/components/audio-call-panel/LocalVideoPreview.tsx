import { CameraOff } from "lucide-react"
import type { RefObject } from "react"
import type { CameraState } from "./types"

interface LocalVideoPreviewProps {
  localStream: MediaStream | null
  cameraState: CameraState
  videoRef: RefObject<HTMLVideoElement | null>
}

const LocalVideoPreview = ({ localStream, cameraState, videoRef }: LocalVideoPreviewProps) => (
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

export default LocalVideoPreview
