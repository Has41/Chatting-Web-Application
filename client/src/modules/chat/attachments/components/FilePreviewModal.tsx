import type { FilePreviewModalProps } from "@chat/attachments/types/attachments"
import { useFilePreviewUpload } from "@chat/attachments/hooks/useFilePreviewUpload"
import FilePreviewComposer from "./file-preview/FilePreviewComposer"
import FilePreviewContent from "./file-preview/FilePreviewContent"
import FilePreviewShell from "./file-preview/FilePreviewShell"

const FilePreviewModal = ({
  file,
  type,
  onCancel,
  recipientId,
  onSend,
  conversationId,
  conversationType
}: FilePreviewModalProps) => {
  const {
    isVisible,
    caption,
    isSending,
    url,
    resolvedFileType,
    actualAttachmentType,
    setCaption,
    handleClose,
    handleFileSend
  } = useFilePreviewUpload({
    file,
    type,
    onCancel,
    recipientId,
    onSend,
    conversationId,
    conversationType
  })

  if (!file || !url) return null

  return (
    <FilePreviewShell isVisible={isVisible} onClose={handleClose}>
      <FilePreviewContent file={file} url={url} resolvedFileType={resolvedFileType} actualAttachmentType={actualAttachmentType} />
      <FilePreviewComposer caption={caption} isSending={isSending} onCaptionChange={setCaption} onSend={handleFileSend} />
    </FilePreviewShell>
  )
}

export default FilePreviewModal
