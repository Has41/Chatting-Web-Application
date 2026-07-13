import type { Conversation, User } from "@shared/types"

export interface FriendConversation extends Conversation {
  isFriend?: boolean
}

export interface GroupModalData {
  _id: string
  friends: User[]
  conversations: FriendConversation[]
}

export interface CreateGroupPayload {
  participants: string[]
}
