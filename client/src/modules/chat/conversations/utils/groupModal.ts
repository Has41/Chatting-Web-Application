import type { User } from "@shared/types"
import type { FriendConversation, GroupModalData } from "@chat/conversations/types/groupModal"

export const getOtherConversationParticipant = (conversation: FriendConversation, currentUserId?: string) =>
  conversation.participants.find((participant): participant is User => typeof participant !== "string" && participant._id !== currentUserId)

export const filterGroupModalData = (data: GroupModalData | undefined, searchQuery: string) => {
  if (!data) {
    return {
      filteredFriends: [] as User[],
      filteredConversations: [] as FriendConversation[],
      nonFriendConversations: [] as FriendConversation[]
    }
  }

  const query = searchQuery.trim().toLowerCase()
  const filteredFriends = data.friends.filter((friend) => friend.username.toLowerCase().includes(query))
  const filteredConversations = data.conversations.filter((conversation) => {
    const other = getOtherConversationParticipant(conversation, data._id)
    return other?.username?.toLowerCase().includes(query)
  })

  return {
    filteredFriends,
    filteredConversations,
    nonFriendConversations: filteredConversations.filter((conversation) => !conversation.isFriend)
  }
}
