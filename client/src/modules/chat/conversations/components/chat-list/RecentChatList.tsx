import ChatListItem from "@chat/conversations/components/chat-list/ChatListItem"
import type { Conversation } from "@shared/types"

interface RecentChatListProps {
  chatList: Conversation[]
  currentUserId?: string
  onlineUserIds: Set<string>
}

const RecentChatList = ({ chatList, currentUserId, onlineUserIds }: RecentChatListProps) => (
  <div className="max-w-full">
    <div>
      <h1 className="mb-4 font-semibold text-black/80">Recent</h1>
    </div>
    {chatList.map((conversation) => (
      <div key={conversation._id} className="my-4 w-full">
        <ul className="space-y-4">
          <ChatListItem conversation={conversation} currentUserId={currentUserId} onlineUserIds={onlineUserIds} />
        </ul>
      </div>
    ))}
  </div>
)

export default RecentChatList
