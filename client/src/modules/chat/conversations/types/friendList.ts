import type { User } from "@shared/types"

export interface FriendRequest {
  from: User
}

export interface FriendConversation {
  _id: string
  participants?: User[]
  conversationType?: "private" | "group"
}

export interface FriendsAndRequestsResponse {
  friends: User[]
  friendRequests: FriendRequest[]
}

export interface FriendConversationsResponse {
  friends: User[]
  conversations: FriendConversation[]
}

export interface RespondFriendRequestPayload {
  userId: string
  response: "accepted" | "rejected"
}
