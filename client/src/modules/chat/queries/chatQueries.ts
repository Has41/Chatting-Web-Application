import { useQuery } from "@tanstack/react-query"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import { getUserConversations } from "@chat/api/chatApi"

export const useChatListQuery = () => {
  return useQuery({
    queryKey: [CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER],
    queryFn: getUserConversations
  })
}
