import { useEffect, useMemo, useState } from "react"
import {
  useFriendConversationsQuery,
  useFriendsAndRequestsQuery,
  useRespondFriendRequestMutation
} from "@chat/conversations/queries/friendListQueries"
import { getFriendChatRoute } from "@chat/conversations/utils/friendList"

export const useFriendList = () => {
  const [openNotification, setOpenNotification] = useState(false)
  const { data: friendsData, error: friendsError } = useFriendsAndRequestsQuery()
  const { data: friendConversationData } = useFriendConversationsQuery()
  const respondFriendRequest = useRespondFriendRequestMutation()

  const friendList = friendsData?.friends ?? []
  const friendRequests = friendsData?.friendRequests ?? []
  const friendConversations = useMemo(() => friendConversationData?.conversations ?? [], [friendConversationData])

  useEffect(() => {
    if (!friendsError) return
    console.error("Error fetching friend list and requests:", friendsError)
  }, [friendsError])

  const toggleNotification = () => setOpenNotification((prev) => !prev)

  return {
    friendList,
    friendRequests,
    openNotification,
    getFriendChatRoute: (friendId: string) => getFriendChatRoute(friendId, friendConversations),
    respondFriendRequest: respondFriendRequest.mutate,
    toggleNotification
  }
}
