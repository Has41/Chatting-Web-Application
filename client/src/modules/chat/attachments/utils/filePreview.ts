import { ROOT_FOLDER } from "@shared/constants/constantValues"
import resolveFilePreviewType from "@shared/utils/resolveFilePreviewType"
import type { FileType } from "@chat/attachments/types/attachments"

interface UploadFolderOptions {
  conversationType?: string
  userId?: string
  recipientId?: string
  conversationId?: string
}

export const createTempMessageId = () => `temp-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`

export const resolveAttachmentType = (file: File): FileType => {
  const resolvedFileType = resolveFilePreviewType({
    mimeType: file.type,
    fileName: file.name
  })

  return resolvedFileType === "image" || resolvedFileType === "video" || resolvedFileType === "audio" ? resolvedFileType : "document"
}

export const createUploadFolder = ({ conversationType, userId, recipientId, conversationId }: UploadFolderOptions) => {
  if (conversationType === "private") return `${ROOT_FOLDER}/${userId}/chat-uploads/chat-with-${recipientId}`
  if (conversationType === "channel") return `${ROOT_FOLDER}/${userId}/chat-uploads/channel-${conversationId}`
  return `${ROOT_FOLDER}/${userId}/chat-uploads/group-${conversationId}`
}
