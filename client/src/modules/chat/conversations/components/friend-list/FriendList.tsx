import UserSearch from "@chat/conversations/components/messages/user-search/UserSearch"
import FriendListHeader from "@chat/conversations/components/friend-list/FriendListHeader"
import FriendsSection from "@chat/conversations/components/friend-list/FriendsSection"
import { useFriendList } from "@chat/conversations/hooks/useFriendList"

const FriendList = () => {
  const {
    friendList,
    friendRequests,
    openNotification,
    getFriendChatRoute,
    respondFriendRequest,
    toggleNotification
  } = useFriendList()

  return (
    <aside
      className="font-poppins h-screen w-1/4 border-r border-l border-r-slate-200 border-l-slate-200 bg-gray-50"
      aria-label="Friend List"
    >
      <section className="p-4">
        <FriendListHeader
          friendRequests={friendRequests}
          openNotification={openNotification}
          onToggleNotification={toggleNotification}
          onRespondFriendRequest={respondFriendRequest}
        />

        <UserSearch />
        <FriendsSection friends={friendList} getFriendChatRoute={getFriendChatRoute} />
      </section>
    </aside>
  )
}

export default FriendList
