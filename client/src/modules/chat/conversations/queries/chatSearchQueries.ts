import { useMutation, useQueryClient } from "@tanstack/react-query"
import { searchUserConversationData } from "@chat/conversations/api/chatSearchApi"
import type { ChatSearchPayload, ChatSearchResponse } from "@chat/conversations/types/chatSearch"

export const chatSearchQueryKeys = {
  result: (query: string) => ["chatSearch", query] as const
}

export const useChatSearchMutation = ({
  onSuccess,
  onError
}: {
  onSuccess: (data: ChatSearchResponse) => void
  onError: (error: unknown) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: searchUserConversationData,
    onSuccess: (data: ChatSearchResponse, variables: ChatSearchPayload) => {
      queryClient.setQueryData(chatSearchQueryKeys.result(variables.dataToSearch), data)
      onSuccess(data)
    },
    onError
  })
}
