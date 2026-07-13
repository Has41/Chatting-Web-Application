import ChatMessages from "../messages/ChatMessages"
import type { Dispatch, RefObject, SetStateAction } from "react"
import type { Conversation } from "@shared/types"
import type { TypingUser } from "@chat/socket/useChatSocket"
import type { ChatMessage, ChatSocketEmitter } from "@chat/conversations/types/chatMessages"

const GroupChatMessages = ({
  lastMessage,
  setMessages,
  conversationId,
  groupData,
  socketMessages,
  socketRef,
  typingUsers
}: {
  lastMessage?: ChatMessage
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
  conversationId?: string
  groupData: Conversation | null
  socketMessages: ChatMessage[]
  socketRef: RefObject<ChatSocketEmitter | null>
  typingUsers: TypingUser[]
}) => (
  <ChatMessages
    lastMessage={lastMessage}
    setMessages={setMessages}
    conversationId={conversationId}
    conversationType="group"
    userData={groupData}
    socketMessages={socketMessages}
    socket={socketRef}
    typingUsers={typingUsers}
  />
)

export default GroupChatMessages
