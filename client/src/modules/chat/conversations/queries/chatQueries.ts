import { useQuery } from "@tanstack/react-query"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import { getUserConversations } from "@chat/conversations/api/chatApi"

export const useChatListQuery = (enabled = true) => {
  return useQuery({
    queryKey: [CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER],
    queryFn: getUserConversations,
    enabled
  })
}
