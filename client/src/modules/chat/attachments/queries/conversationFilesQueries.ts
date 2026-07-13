import { useQuery } from "@tanstack/react-query"
import { getConversationFiles } from "@chat/attachments/api/conversationFilesApi"

export const conversationFilesQueryKeys = {
  detail: (conversationId?: string) => ["conversationFiles", conversationId] as const
}

export const useConversationFilesQuery = (conversationId?: string) =>
  useQuery({
    queryKey: conversationFilesQueryKeys.detail(conversationId),
    queryFn: () => getConversationFiles(conversationId ?? ""),
    enabled: !!conversationId
  })
