import { getChatConversationRoute, getGroupConversationRoute } from "@shared/constants/routePaths"
import { formatTime } from "@shared/utils/dateTime"
import type { Conversation, User } from "@shared/types"

export interface ChatListItemDisplay {
  displayName?: string
  imageUrl?: string
  initial?: string
  isGroup: boolean
  isOtherUserOnline: boolean
  lastMessagePreview: string
  lastMessageTime?: string
  route: string
}

const isUser = (participant: User | string): participant is User =>
  typeof participant === "object" && participant !== null && "_id" in participant

export const getOtherParticipant = (conversation: Conversation, currentUserId?: string) => {
  return conversation.participants.find((participant) => isUser(participant) && participant._id !== currentUserId) as
    | User
    | undefined
}

export const getConversationRoute = (conversation: Conversation) => {
  return conversation.conversationType === "private"
    ? getChatConversationRoute(conversation._id)
    : getGroupConversationRoute(conversation._id)
}

export const getLastMessagePreview = (conversation: Conversation) => {
  return conversation.lastMessage?.content || (conversation.lastMessage?.media?.mediaUrl ? "It's an image" : "")
}

export const formatLastMessageTime = (createdAt?: string) => {
  return createdAt ? formatTime(createdAt) : undefined
}

export const getChatListItemDisplay = ({
  conversation,
  currentUserId,
  onlineUserIds
}: {
  conversation: Conversation
  currentUserId?: string
  onlineUserIds: Set<string>
}): ChatListItemDisplay => {
  const isGroup = conversation.conversationType === "group"
  const otherUser = isGroup ? undefined : getOtherParticipant(conversation, currentUserId)
  const displayName = isGroup ? conversation.groupName : otherUser?.displayName || otherUser?.username

  return {
    displayName,
    imageUrl: isGroup ? conversation.groupPicture?.url : otherUser?.profilePicture?.url,
    initial: displayName?.charAt(0).toUpperCase(),
    isGroup,
    isOtherUserOnline: !!otherUser?._id && onlineUserIds.has(otherUser._id),
    lastMessagePreview: getLastMessagePreview(conversation),
    lastMessageTime: formatLastMessageTime(conversation.lastMessage?.createdAt),
    route: getConversationRoute(conversation)
  }
}
