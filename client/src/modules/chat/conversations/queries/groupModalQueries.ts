import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createGroupConversation, getGroupModalData } from "@chat/conversations/api/groupModalApi"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"

export const groupModalQueryKeys = {
  data: ["userFriendsAndConversations"] as const,
  friendConversations: ["friendConversations"] as const
}

export const useGroupModalDataQuery = () =>
  useQuery({
    queryKey: groupModalQueryKeys.data,
    queryFn: getGroupModalData
  })

export const useCreateGroupConversationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGroupConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER] })
      queryClient.invalidateQueries({ queryKey: groupModalQueryKeys.friendConversations })
      queryClient.invalidateQueries({ queryKey: groupModalQueryKeys.data })
    }
  })
}
