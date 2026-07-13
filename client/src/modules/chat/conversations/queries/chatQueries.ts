import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import { getConversationMessages, getCurrentConversation, getUserConversations } from "@chat/conversations/api/chatApi"
import type { ConversationMessagesPage } from "@chat/conversations/types/chatMessages"

export const conversationMessageQueryKeys = {
  all: ["getUserMessages"] as const,
  detail: (conversationId?: string) => ["getUserMessages", conversationId] as const
}

export const conversationQueryKeys = {
  group: (conversationId?: string) => ["groupConversation", conversationId] as const
}

export const useChatListQuery = (enabled = true) => {
  return useQuery({
    queryKey: [CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER],
    queryFn: getUserConversations,
    enabled
  })
}

export const useConversationMessagesQuery = ({
  conversationId,
  enabled,
  pageSize = 20
}: {
  conversationId?: string
  enabled: boolean
  pageSize?: number
}) => {
  return useInfiniteQuery({
    queryKey: conversationMessageQueryKeys.detail(conversationId),
    queryFn: ({ pageParam = 1 }) =>
      getConversationMessages({
        conversationId: conversationId ?? "",
        page: pageParam,
        limit: pageSize
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ConversationMessagesPage, pages: ConversationMessagesPage[]) =>
      lastPage.messages.length === pageSize ? pages.length + 1 : undefined,
    enabled: enabled && !!conversationId
  })
}

export const useGroupConversationQuery = ({
  conversationId,
  enabled
}: {
  conversationId?: string
  enabled: boolean
}) =>
  useQuery({
    queryKey: conversationQueryKeys.group(conversationId),
    queryFn: () => getCurrentConversation(conversationId ?? ""),
    enabled: enabled && !!conversationId
  })
