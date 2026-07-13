import { useState } from "react"
import useAuth from "@auth/hooks/useAuth"
import useStories from "@stories/queries/storyQueries"
import useChatList from "@chat/conversations/hooks/useChatList"
import useFriendPresence from "@chat/conversations/hooks/useFriendPresence"
import { useFriendConversationsQuery } from "@chat/conversations/queries/friendListQueries"

export const useChatListPanel = () => {
  const { user } = useAuth()
  const { chatList } = useChatList()
  const [showDropdown, setShowDropdown] = useState(false)
  const [openGroupModal, setOpenGroupModal] = useState(false)

  const { data: friendConversationData } = useFriendConversationsQuery(!!user)
  const friends = friendConversationData?.friends ?? []
  const { onlineUserIds } = useFriendPresence(friends)
  const { data: stories = [] } = useStories(!!user)

  const toggleDropdown = () => setShowDropdown((prev) => !prev)
  const openCreateGroupModal = () => {
    setShowDropdown(false)
    setOpenGroupModal(true)
  }
  const closeCreateGroupModal = () => setOpenGroupModal(false)

  return {
    chatList,
    currentUserId: user?._id,
    friends,
    onlineUserIds,
    stories,
    showDropdown,
    openGroupModal,
    toggleDropdown,
    openCreateGroupModal,
    closeCreateGroupModal
  }
}
