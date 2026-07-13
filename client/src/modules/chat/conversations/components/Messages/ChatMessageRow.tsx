import Message from "./Message"
import { getMessageSenderId } from "@chat/conversations/utils/chatMessages"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"
import type {
  ChatConversationType,
  ChatMessage,
  ChatParticipant
} from "@chat/conversations/types/chatMessages"
import type { RefObject, Dispatch, SetStateAction } from "react"

interface ChatMessageRowProps {
  message: ChatMessage
  currentUserId: string
  conversationType?: ChatConversationType
  userData?: ChatParticipant | null
  groupRecipients: ChatParticipant[]
  lastMessage?: ChatMessage
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
  conversationId?: string
  socket: RefObject<{ emit: (...args: any[]) => void } | null>
  mediaGallery: MediaViewerItem[]
  mediaGalleryIndex?: number
}

const FALLBACK_AVATAR_URL = "https://via.placeholder.com/40"

const ChatMessageRow = ({
  message,
  currentUserId,
  conversationType,
  userData,
  groupRecipients,
  lastMessage,
  setMessages,
  conversationId,
  socket,
  mediaGallery,
  mediaGalleryIndex
}: ChatMessageRowProps) => {
  const senderId = getMessageSenderId(message)
  const isSender = senderId === currentUserId
  const sender = conversationType === "group" ? groupRecipients.find((recipient) => recipient._id === senderId) : userData

  return (
    <div className={`flex items-end ${isSender ? "mb-1 justify-end" : "mb-4 justify-start"}`}>
      {!isSender && sender && (
        <div className="mt-4 mr-2 flex flex-col items-center">
          <img
            src={sender.profilePicture?.url || FALLBACK_AVATAR_URL}
            alt={sender.username}
            className={`${conversationType === "group" ? "mb-1 " : ""}h-8 w-8 rounded-full object-cover`}
          />
        </div>
      )}

      <Message
        isSender={isSender}
        message={message}
        recipientData={conversationType === "group" ? groupRecipients : []}
        lastMessage={lastMessage}
        setMessages={setMessages}
        conversationId={conversationId}
        socket={socket}
        conversationType={conversationType}
        mediaGallery={mediaGallery}
        mediaGalleryIndex={mediaGalleryIndex}
      />
    </div>
  )
}

export default ChatMessageRow
