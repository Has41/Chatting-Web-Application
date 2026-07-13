import ComposerActions from "@chat/composer/components/message-composer/ComposerActions"
import ComposerAudioControl from "@chat/composer/components/message-composer/ComposerAudioControl"
import ComposerFilePreview from "@chat/composer/components/message-composer/ComposerFilePreview"
import ComposerTextInput from "@chat/composer/components/message-composer/ComposerTextInput"
import { useMessageComposer } from "@chat/composer/hooks/useMessageComposer"
import type { MessageComposerProps } from "@chat/composer/types/messageComposer"

const MessageComposer = ({
  setMessageContent,
  messageContent,
  recipientId,
  socketRef,
  conversationType = "private",
  conversationId,
  sendMessage,
  setMessages,
  onTypingStart,
  onTypingStop
}: MessageComposerProps) => {
  const composer = useMessageComposer({
    setMessageContent,
    messageContent,
    recipientId,
    socketRef,
    conversationType,
    conversationId,
    sendMessage,
    setMessages,
    onTypingStart,
    onTypingStop
  })

  if (!composer.user) return null

  return (
    <div className="relative flex max-w-full items-center gap-3 border-t p-4">
      <ComposerFilePreview
        previewFile={composer.state.previewFile}
        attachmentType={composer.state.attachmentType}
        recipientId={recipientId}
        conversationId={conversationId}
        conversationType={conversationType}
        onSend={composer.handlers.handleSendMessage}
        onCancel={() => composer.handlers.setPreviewFile(null)}
      />
      <ComposerAudioControl
        isRecording={composer.state.isRecording}
        setIsRecording={composer.handlers.setIsRecording}
        onSend={composer.handlers.handleSendMessage}
        conversationType={conversationType}
        recipientId={recipientId}
        conversationId={conversationId}
      />
      {!composer.state.isRecording && (
        <ComposerTextInput
          messageContent={messageContent}
          conversationId={conversationId}
          onChange={composer.handlers.handleMessageInputChange}
          onSend={composer.handlers.handleSendMessage}
        />
      )}
      {!composer.state.isRecording && (
        <ComposerActions
          messageContent={messageContent}
          conversationId={conversationId}
          attachmentType={composer.state.attachmentType}
          showAttachmentOptions={composer.state.showAttachmentOptions}
          fileInputRef={composer.refs.fileInputRef}
          onAttachmentSelect={composer.handlers.handleAttachmentSelect}
          onFileChange={composer.handlers.handleFileChange}
          onSend={composer.handlers.handleSendMessage}
          setShowAttachmentOptions={composer.handlers.setShowAttachmentOptions}
        />
      )}
    </div>
  )
}

export default MessageComposer
