import type { AudioRecorderProps } from "@chat/attachments/types/attachments"
import { useAudioRecorder } from "@chat/composer/hooks/useAudioRecorder"
import AudioRecorderControls from "./audio-recorder/AudioRecorderControls"

const AudioRecorder = (props: AudioRecorderProps) => {
  const { isPaused, isSending, startRecording, pauseResumeRecording, cancelRecording, sendRecording } = useAudioRecorder(props)

  return (
    <div className="flex items-center gap-2">
      <AudioRecorderControls
        isRecording={props.isRecording}
        isPaused={isPaused}
        isSending={isSending}
        onStart={startRecording}
        onCancel={cancelRecording}
        onPauseResume={pauseResumeRecording}
        onSend={sendRecording}
      />
    </div>
  )
}

export default AudioRecorder
