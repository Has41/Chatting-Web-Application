import type { User } from "@shared/types"
import type { MessageReactionItem } from "@chat/messages/components/MessageReactions"

export interface SeenUser {
  _id?: string
  user: { _id?: string; username?: string; profilePicture?: { url?: string } }
  seenAt?: string
}

export interface ChatMessage {
  _id: string
  sender: string | { _id?: string }
  content?: string
  messageType?: string
  media?: {
    mediaUrl?: string
    caption?: string
    thumbnailUrl?: string
    mediaType?: string
    mimeType?: string
    fileName?: string
  }
  clientTempId?: string
  localStatus?: "sending" | "failed"
  createdAt: string
  editedAt?: string
  seenBy?: SeenUser[]
  reactions?: MessageReactionItem[]
}

export interface ConversationMessagesPage {
  messages: ChatMessage[]
}

export interface ConversationMessagesCache {
  pages: ConversationMessagesPage[]
}

export type ChatConversationType = "private" | "group"

export type ChatParticipant = Pick<User, "_id" | "username" | "profilePicture">

export interface ChatSocketEmitter {
  emit: (event: string, ...args: unknown[]) => void
}
