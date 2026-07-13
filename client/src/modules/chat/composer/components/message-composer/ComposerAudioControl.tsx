import AudioRecorder from "@chat/composer/components/AudioRecorder"
import type { Dispatch, SetStateAction } from "react"
import type { ConversationType } from "@chat/attachments/types/attachments"
import type { ComposerSendHandler } from "@chat/composer/types/messageComposer"

interface ComposerAudioControlProps {
  isRecording: boolean
  setIsRecording: Dispatch<SetStateAction<boolean>>
  onSend: ComposerSendHandler
  conversationType: ConversationType
  recipientId?: string
  conversationId?: string
}

const ComposerAudioControl = ({
  isRecording,
  setIsRecording,
  onSend,
  conversationType,
  recipientId,
  conversationId
}: ComposerAudioControlProps) => (
  <div className={`${isRecording ? "w-[30%]" : "w-[5%]"}`}>
    <AudioRecorder
      onSend={onSend}
      isRecording={isRecording}
      conversationType={conversationType}
      setIsRecording={setIsRecording}
      recipientId={recipientId}
      conversationId={conversationId}
    />
  </div>
)

export default ComposerAudioControl
