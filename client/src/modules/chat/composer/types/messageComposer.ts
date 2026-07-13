import type { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react"
import type { ConversationType, FileType, SendMessagePayload } from "@chat/attachments/types/attachments"
import type { ChatMessage } from "@chat/conversations/types/chatMessages"

export interface AttachmentPickerState {
  type: FileType | null
  requestId: number
}

export interface SocketSendMessagePayload {
  messageData?: {
    clientTempId?: string
    conversationId?: string
    sender?: string
    content?: string
    recipient?: string
    messageType?: "text" | "file"
    conversationType?: ConversationType
  }
  fileData?: Record<string, unknown>
}

export interface MessageComposerProps {
  setMessageContent: (value: string) => void
  messageContent: string
  recipientId?: string
  socketRef: RefObject<unknown>
  conversationType?: ConversationType
  conversationId?: string
  sendMessage: (payload: SocketSendMessagePayload) => void
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
  onTypingStart?: () => void
  onTypingStop?: () => void
}

export type ComposerSendHandler = (payload: SendMessagePayload) => void

export interface ComposerActionsProps {
  messageContent: string
  conversationId?: string
  attachmentType: FileType | null
  showAttachmentOptions: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  onAttachmentSelect: (type: FileType) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSend: ComposerSendHandler
  setShowAttachmentOptions: Dispatch<SetStateAction<boolean>>
}
