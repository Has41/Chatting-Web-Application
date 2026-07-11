import type { Conversation, Message, User } from "@shared/types"

export interface SearchConversation extends Conversation {
  lastMessageData?: Message
}

export interface SearchFriend extends User {
  conversation?: string[]
}
