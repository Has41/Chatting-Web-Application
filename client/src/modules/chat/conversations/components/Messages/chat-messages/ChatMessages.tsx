import useAuth from "@auth/hooks/useAuth"
import { useMemo } from "react"
import TypingIndicator from "./TypingIndicator"
import ChatMessageRow from "./ChatMessageRow"
import { useChatMessages } from "@chat/conversations/hooks/useChatMessages"
import { getConversationRecipients, getTypingProfile } from "@chat/conversations/utils/chatMessages"
import type { TypingUser } from "@chat/socket/useChatSocket"
import type { ChatConversationType, ChatMessage, ChatSocketEmitter } from "@chat/conversations/types/chatMessages"
import type { RefObject, Dispatch, SetStateAction } from "react"
import type { Conversation, User } from "@shared/types"

const EMPTY_TYPING_USERS: TypingUser[] = []

interface ChatMessagesProps {
  conversationId?: string
  userData?: User | Conversation | null
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
  socketMessages: ChatMessage[]
  lastMessage?: ChatMessage
  socket: RefObject<ChatSocketEmitter | null>
  conversationType?: ChatConversationType
  typingUsers?: TypingUser[]
}

const ChatMessages = ({
  conversationId,
  userData,
  setMessages,
  socketMessages,
  lastMessage,
  socket,
  conversationType,
  typingUsers = EMPTY_TYPING_USERS
}: ChatMessagesProps) => {
  const { user } = useAuth()
  const currentUserId = user?._id
  const { scrollRef, messages, mediaGallery, mediaGalleryIndexByMessageId, isFetchingNextPage, handleScroll } =
    useChatMessages({
      conversationId,
      currentUserId,
      socketMessages,
      typingUsers
    })

  const groupRecipients = useMemo(
    () => getConversationRecipients(conversationType, userData, currentUserId ?? ""),
    [conversationType, currentUserId, userData]
  )
  const typingUser = typingUsers[0]
  const typingProfile = getTypingProfile({
    conversationType,
    groupRecipients,
    typingUser,
    userData: conversationType === "group" ? null : (userData as User | null | undefined)
  })
  const privateUserData = conversationType === "group" ? null : (userData as User | null | undefined)

  if (!user || !currentUserId) return null

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="grow overflow-y-auto bg-gray-100 p-4">
      {isFetchingNextPage && <div className="text-center text-sm text-gray-500">Loading more messages...</div>}

      {messages.map((message) => (
        <ChatMessageRow
          key={message._id}
          message={message}
          currentUserId={currentUserId}
          conversationType={conversationType}
          userData={privateUserData}
          groupRecipients={groupRecipients}
          lastMessage={lastMessage}
          setMessages={setMessages}
          conversationId={conversationId}
          socket={socket}
          mediaGallery={mediaGallery}
          mediaGalleryIndex={mediaGalleryIndexByMessageId.get(message._id)}
        />
      ))}

      <TypingIndicator
        typingUsers={typingUsers}
        avatarUrl={typingProfile?.profilePicture?.url}
        avatarLabel={typingProfile?.username || typingUser?.username}
      />
    </div>
  )
}

export default ChatMessages
