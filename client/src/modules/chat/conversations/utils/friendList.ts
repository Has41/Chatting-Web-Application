import { getChatConversationRoute, getNewChatRoute } from "@shared/constants/routePaths"
import type { FriendConversation } from "@chat/conversations/types/friendList"

export const getFriendChatRoute = (friendId: string, friendConversations: FriendConversation[]) => {
  const existingConversation = friendConversations.find((conversation) =>
    conversation.participants?.some((participant) => participant?._id === friendId)
  )

  return existingConversation ? getChatConversationRoute(existingConversation._id) : getNewChatRoute(friendId)
}
