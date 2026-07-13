import { Paperclip, Send, Smile } from "lucide-react"
import AttachmentMenu from "@chat/composer/components/AttachmentMenu"
import { getAcceptedTypes } from "@chat/composer/utils/messageComposer"
import type { ComposerActionsProps } from "@chat/composer/types/messageComposer"

const ComposerActions = ({
  messageContent,
  conversationId,
  attachmentType,
  showAttachmentOptions,
  fileInputRef,
  onAttachmentSelect,
  onFileChange,
  onSend,
  setShowAttachmentOptions
}: ComposerActionsProps) => (
  <div className="flex w-1/6 gap-x-1">
    {showAttachmentOptions && (
      <AttachmentMenu
        onSelect={(type) => {
          onAttachmentSelect(type)
          setShowAttachmentOptions(false)
        }}
        onClose={() => setShowAttachmentOptions(false)}
      />
    )}
    <button
      type="button"
      onClick={() => setShowAttachmentOptions((prev) => !prev)}
      className="hover:text-custom-text rounded-full p-3 text-black/80 transition-all duration-500"
      aria-label="Add attachment"
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={getAcceptedTypes(attachmentType)}
        onChange={onFileChange}
      />
      <Paperclip className="size-6" aria-hidden="true" />
    </button>
    <button
      type="button"
      className="hover:text-custom-text rounded-full p-3 text-black/80 transition-all duration-500"
      aria-label="Open emoji picker"
    >
      <Smile className="size-6" aria-hidden="true" />
    </button>
    <button
      type="button"
      onClick={() => onSend({ conversationId, messageContent, messageType: "text" })}
      className="bg-custom-green rounded-full p-3 text-white transition-all duration-500 hover:bg-green-400"
      aria-label="Send message"
    >
      <Send className="size-6" strokeWidth={1.8} />
    </button>
  </div>
)

export default ComposerActions
