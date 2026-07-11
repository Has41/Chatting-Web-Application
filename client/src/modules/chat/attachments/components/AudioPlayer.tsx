import { useRef, useState } from "react"

interface AudioPlayerProps {
  mediaUrl: string
}

const AudioPlayer = ({ mediaUrl }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const current = audioRef.current.currentTime
    const total = audioRef.current.duration
    setProgress((current / total) * 100)
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-lg bg-gray-100 p-3 shadow">
      <audio ref={audioRef} src={mediaUrl} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />

      <button
        type="button"
        onClick={togglePlay}
        className="rounded-full bg-blue-500 p-2 text-white"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? "⏸" : "▶️"}
      </button>

      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-300">
        <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  )
}

export default AudioPlayer
