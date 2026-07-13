import { Link } from "react-router-dom"
import ChatListAvatar from "@chat/conversations/components/chat-list/ChatListAvatar"
import { getChatListItemDisplay } from "@chat/conversations/utils/chatListDisplay"
import type { Conversation } from "@shared/types"

interface ChatListItemProps {
  conversation: Conversation
  currentUserId?: string
  onlineUserIds: Set<string>
}

const ChatListItem = ({ conversation, currentUserId, onlineUserIds }: ChatListItemProps) => {
  const display = getChatListItemDisplay({ conversation, currentUserId, onlineUserIds })

  return (
    <li>
      <Link
        to={display.route}
        className="flex cursor-pointer items-center rounded p-2 transition-all duration-500 hover:bg-gray-100"
      >
        <ChatListAvatar
          imageUrl={display.imageUrl}
          displayName={display.displayName}
          initial={display.initial}
          showPresence={!display.isGroup}
          isOnline={display.isOtherUserOnline}
        />

        <div className="flex-1">
          <div className="max-w-36 truncate font-semibold text-gray-800" title={display.displayName}>
            {display.displayName}
          </div>

          <div className="max-w-36 truncate text-xs text-gray-600" title={display.lastMessagePreview}>
            {display.lastMessagePreview}
          </div>
        </div>

        {display.lastMessageTime && (
          <div className="mb-auto flex flex-col text-xs text-gray-500">
            <p>{display.lastMessageTime}</p>
          </div>
        )}
      </Link>
    </li>
  )
}

export default ChatListItem
