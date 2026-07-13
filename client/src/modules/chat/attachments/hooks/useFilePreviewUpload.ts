import { useEffect, useMemo, useState } from "react"
import useAuth from "@auth/hooks/useAuth"
import useCloudinaryUpload from "@shared/hooks/useCloudinaryUpload"
import resolveFilePreviewType from "@shared/utils/resolveFilePreviewType"
import type { FilePreviewModalProps } from "@chat/attachments/types/attachments"
import { createTempMessageId, createUploadFolder, resolveAttachmentType } from "@chat/attachments/utils/filePreview"

export const useFilePreviewUpload = ({
  file,
  onCancel,
  recipientId,
  onSend,
  conversationId,
  conversationType
}: FilePreviewModalProps) => {
  const { user } = useAuth()
  const { uploadFile } = useCloudinaryUpload()
  const [isVisible, setIsVisible] = useState(Boolean(file))
  const [caption, setCaption] = useState("")
  const [isSending, setIsSending] = useState(false)
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  const resolvedFileType = file
    ? resolveFilePreviewType({
        mimeType: file.type,
        fileName: file.name
      })
    : "other"
  const actualAttachmentType = file ? resolveAttachmentType(file) : "document"

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onCancel, 200)
  }

  const handleFileSend = async () => {
    if (!file) return
    const clientTempId = createTempMessageId()
    const localPreviewUrl = URL.createObjectURL(file)

    onSend({
      messageType: "file",
      fileMeta: {
        media_url: localPreviewUrl,
        caption,
        thumbnailUrl: "",
        mediaType: actualAttachmentType,
        mimeType: file.type,
        fileName: file.name
      },
      conversationId,
      clientTempId,
      optimisticOnly: true
    })

    setIsSending(true)
    handleClose()

    try {
      const res = await uploadFile(
        file,
        createUploadFolder({
          conversationType,
          userId: user?._id,
          recipientId,
          conversationId
        }),
        file.type,
        actualAttachmentType
      )

      if (res?.secure_url) {
        onSend({
          messageType: "file",
          fileMeta: {
            public_url: res?.public_id,
            media_url: res?.secure_url,
            caption,
            thumbnailUrl: res?.eager?.[0]?.secure_url || "",
            mediaType: actualAttachmentType,
            mimeType: file.type,
            fileName: file.name
          },
          conversationId,
          clientTempId
        })
      } else {
        onSend({
          messageType: "file",
          conversationId,
          clientTempId,
          markFailed: true
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      onSend({
        messageType: "file",
        conversationId,
        clientTempId,
        markFailed: true
      })
    }
  }

  return {
    isVisible,
    caption,
    isSending,
    url,
    resolvedFileType,
    actualAttachmentType,
    setCaption,
    handleClose,
    handleFileSend
  }
}
