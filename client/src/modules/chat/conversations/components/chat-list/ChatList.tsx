import GroupModal from "@chat/conversations/components/group-modal/GroupModal"
import ChatSearch from "@chat/conversations/components/messages/chat-search/ChatSearch"
import StoryTray from "@stories/components/StoryTray"
import ChatListHeader from "@chat/conversations/components/chat-list/ChatListHeader"
import EmptyChatList from "@chat/conversations/components/chat-list/EmptyChatList"
import RecentChatList from "@chat/conversations/components/chat-list/RecentChatList"
import { useChatListPanel } from "@chat/conversations/hooks/useChatListPanel"

const ChatList = () => {
  const {
    chatList,
    currentUserId,
    friends,
    onlineUserIds,
    stories,
    showDropdown,
    openGroupModal,
    toggleDropdown,
    openCreateGroupModal,
    closeCreateGroupModal
  } = useChatListPanel()

  return (
    <aside
      className="font-poppins h-screen w-1/4 border-r border-l border-r-slate-200 border-l-slate-200 bg-gray-50"
      aria-label="Chat List"
    >
      <section className="px-4 py-6">
        <ChatListHeader
          showDropdown={showDropdown}
          onToggleDropdown={toggleDropdown}
          onMakeGroup={openCreateGroupModal}
        />
        {openGroupModal && <GroupModal onClose={closeCreateGroupModal} />}

        <ChatSearch />
        <StoryTray stories={stories} friends={friends} onlineUserIds={onlineUserIds} />

        <RecentChatList chatList={chatList} currentUserId={currentUserId} onlineUserIds={onlineUserIds} />
        {chatList.length === 0 && <EmptyChatList />}
      </section>
    </aside>
  )
}

export default ChatList
