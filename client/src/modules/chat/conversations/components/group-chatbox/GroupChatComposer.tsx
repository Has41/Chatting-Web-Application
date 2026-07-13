import SendMessage from "../messages/SendMessage"
import type { Dispatch, RefObject, SetStateAction } from "react"
import type { ChatMessage } from "@chat/conversations/types/chatMessages"

const GroupChatComposer = ({
  sendMessage,
  setMessages,
  conversationId,
  socketRef,
  messageContent,
  setMessageContent,
  onTypingStart,
  onTypingStop
}: {
  sendMessage: (...args: any[]) => void
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
  conversationId?: string
  socketRef: RefObject<{ emit: (...args: any[]) => void } | null>
  messageContent: string
  setMessageContent: (value: string) => void
  onTypingStart: () => void
  onTypingStop: () => void
}) => (
  <SendMessage
    sendMessage={sendMessage}
    setMessages={setMessages}
    conversationId={conversationId}
    socketRef={socketRef}
    conversationType="group"
    messageContent={messageContent}
    setMessageContent={setMessageContent}
    onTypingStart={onTypingStart}
    onTypingStop={onTypingStop}
  />
)

export default GroupChatComposer
