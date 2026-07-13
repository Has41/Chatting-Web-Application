import FilePreviewModal from "@chat/attachments/components/FilePreviewModal"
import type { ConversationType, FileType } from "@chat/attachments/types/attachments"
import type { ComposerSendHandler } from "@chat/composer/types/messageComposer"

interface ComposerFilePreviewProps {
  previewFile: File | null
  attachmentType: FileType | null
  recipientId?: string
  conversationId?: string
  conversationType: ConversationType
  onSend: ComposerSendHandler
  onCancel: () => void
}

const ComposerFilePreview = ({
  previewFile,
  attachmentType,
  recipientId,
  conversationId,
  conversationType,
  onSend,
  onCancel
}: ComposerFilePreviewProps) => {
  if (!previewFile) return null

  return (
    <FilePreviewModal
      file={previewFile}
      type={attachmentType ?? "document"}
      recipientId={recipientId}
      conversationId={conversationId}
      conversationType={conversationType}
      onSend={onSend}
      onCancel={onCancel}
    />
  )
}

export default ComposerFilePreview
