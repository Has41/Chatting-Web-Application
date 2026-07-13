import SendMessage from "../messages/SendMessage"
import type { Dispatch, RefObject, SetStateAction } from "react"
import type { ChatMessage, ChatSocketEmitter } from "@chat/conversations/types/chatMessages"
import type { SocketSendMessagePayload } from "@chat/composer/types/messageComposer"

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
  sendMessage: (payload: SocketSendMessagePayload) => void
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
  conversationId?: string
  socketRef: RefObject<ChatSocketEmitter | null>
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
