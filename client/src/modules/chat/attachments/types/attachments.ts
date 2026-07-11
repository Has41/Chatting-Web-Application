import type { Dispatch, SetStateAction } from "react"

export type ConversationType = "private" | "group" | "channel"
export type FileType = "image" | "video" | "audio" | "document"

export interface MessageFileMeta {
  public_url?: string
  media_url: string
  caption?: string
  thumbnailUrl?: string
  mediaType?: FileType
  mimeType?: string
  fileName?: string
}

export interface SendMessagePayload {
  messageType: "text" | "file"
  conversationId?: string
  fileMeta?: MessageFileMeta
  content?: string
  messageContent?: string
  clientTempId?: string
  optimisticOnly?: boolean
  markFailed?: boolean
}

export interface FilePreviewModalProps {
  file: File | null
  type: FileType
  onCancel: () => void
  recipientId?: string
  onSend: (payload: SendMessagePayload) => void
  conversationId?: string
  conversationType?: ConversationType
}

export interface AudioRecorderProps {
  onSend: (payload: SendMessagePayload) => void
  isRecording: boolean
  setIsRecording: Dispatch<SetStateAction<boolean>>
  recipientId?: string
  conversationId?: string
  conversationType?: ConversationType
}
