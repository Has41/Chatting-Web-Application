import { Mic, Pause, Play, Send, Trash2 } from "lucide-react"

interface AudioRecorderControlsProps {
  isRecording: boolean
  isPaused: boolean
  isSending: boolean
  onStart: () => void
  onCancel: () => void
  onPauseResume: () => void
  onSend: () => void
}

const AudioRecorderControls = ({
  isRecording,
  isPaused,
  isSending,
  onStart,
  onCancel,
  onPauseResume,
  onSend
}: AudioRecorderControlsProps) => {
  if (!isRecording) {
    return (
      <button
        type="button"
        onClick={onStart}
        className="hover:text-custom-text rounded-full p-3 text-black/80 transition-all duration-500"
        aria-label="Start voice recording"
      >
        <Mic className="size-6" />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSending}
        className="rounded-full bg-gray-200 p-2 text-gray-500 transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Cancel voice recording"
      >
        <Trash2 className="size-4" />
      </button>
      <span className="animate-pulse text-red-500">{isSending ? "Sending..." : "Recording..."}</span>
      <button
        type="button"
        onClick={onPauseResume}
        disabled={isSending}
        className="rounded-full bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={isPaused ? "Resume voice recording" : "Pause voice recording"}
      >
        {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
      </button>
      <button
        type="button"
        onClick={onSend}
        disabled={isSending}
        className="rounded-lg bg-blue-500 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="inline-flex items-center gap-1">
          <Send className="size-4" />
          {isSending ? "Sending" : "Send"}
        </span>
      </button>
    </div>
  )
}

export default AudioRecorderControls
