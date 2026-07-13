import type { ConversationType, FileType, MessageFileMeta } from "@chat/attachments/types/attachments"
import type { ChatMessage } from "@chat/conversations/types/chatMessages"

export const getAcceptedTypes = (type: FileType | null) => {
  switch (type) {
    case "image":
      return "image/*"
    case "video":
      return "video/*"
    case "document":
      return ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
    case "audio":
      return "audio/*"
    default:
      return "*"
  }
}

export const createFileSocketData = (fileMeta: MessageFileMeta, attachmentType: FileType | null) => ({
  publicId: fileMeta.public_url,
  url: fileMeta.media_url,
  caption: fileMeta.caption || "",
  thumbnailUrl: fileMeta.thumbnailUrl || "",
  mediaType: fileMeta.mediaType || attachmentType || "",
  mimeType: fileMeta.mimeType || "",
  fileName: fileMeta.fileName || ""
})

export const createOptimisticMessage = ({
  clientTempId,
  conversationId,
  conversationType,
  fileMeta,
  messageContent,
  messageType,
  recipientId,
  senderId,
  attachmentType
}: {
  clientTempId: string
  conversationId?: string
  conversationType: ConversationType
  fileMeta?: MessageFileMeta | null
  messageContent: string
  messageType: "text" | "file"
  recipientId?: string
  senderId: string
  attachmentType: FileType | null
}): ChatMessage => ({
  _id: clientTempId,
  clientTempId,
  sender: senderId,
  content: messageContent,
  messageType,
  media:
    messageType === "file" && fileMeta
      ? {
          publicId: fileMeta.public_url,
          mediaUrl: fileMeta.media_url,
          caption: fileMeta.caption || "",
          thumbnailUrl: fileMeta.thumbnailUrl || "",
          mediaType: fileMeta.mediaType || attachmentType || "",
          mimeType: fileMeta.mimeType || "",
          fileName: fileMeta.fileName || ""
        }
      : undefined,
  seenBy: [],
  createdAt: new Date().toISOString(),
  localStatus: "sending",
  conversation: conversationId,
  conversationId,
  conversationType,
  recipient: recipientId
} as ChatMessage)
