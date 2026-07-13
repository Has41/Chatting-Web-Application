import axiosInstance from "@shared/api/api-client"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import type { Conversation } from "@shared/types"
import type { ConversationMessagesPage } from "@chat/conversations/types/chatMessages"

export const getUserConversations = async () => {
  const response = await axiosInstance.get(CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER)
  return response.data
}

export const getConversationMessages = async ({
  conversationId,
  page,
  limit = 20
}: {
  conversationId: string
  page: number
  limit?: number
}): Promise<ConversationMessagesPage> => {
  const response = await axiosInstance.get(`${CONVERSATION_PATHS.GET_CURRENT_MESSAGES}/${conversationId}`, {
    params: { page, limit }
  })
  return response.data
}

export const getCurrentConversation = async (conversationId: string): Promise<{ conversation: Conversation }> => {
  const response = await axiosInstance.get(`${CONVERSATION_PATHS.GET_CURRENT_CONVO}/${conversationId}`)
  return response.data
}
