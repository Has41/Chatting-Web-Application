import { useCallback, useEffect, useMemo, useRef, type UIEvent } from "react"
import { useConversationMessagesQuery } from "@chat/conversations/queries/chatQueries"
import { buildMessageMediaGallery, mergeConversationMessages } from "@chat/conversations/utils/chatMessages"
import type { TypingUser } from "@chat/socket/useChatSocket"
import type { ChatMessage, ConversationMessagesPage } from "@chat/conversations/types/chatMessages"

export const useChatMessages = ({
  conversationId,
  currentUserId,
  socketMessages,
  typingUsers
}: {
  conversationId?: string
  currentUserId?: string
  socketMessages: ChatMessage[]
  typingUsers: TypingUser[]
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversationMessagesQuery({
    conversationId,
    enabled: !!conversationId && !!currentUserId
  })

  const fetchedMessages = useMemo(
    () => data?.pages.flatMap((page: ConversationMessagesPage) => page.messages) ?? [],
    [data?.pages]
  )
  const messages = useMemo(() => mergeConversationMessages(fetchedMessages, socketMessages), [fetchedMessages, socketMessages])
  const { mediaGallery, mediaGalleryIndexByMessageId } = useMemo(() => buildMessageMediaGallery(messages), [messages])

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      if (event.currentTarget.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, typingUsers.length])

  return {
    scrollRef,
    messages,
    mediaGallery,
    mediaGalleryIndexByMessageId,
    isFetchingNextPage,
    handleScroll
  }
}
