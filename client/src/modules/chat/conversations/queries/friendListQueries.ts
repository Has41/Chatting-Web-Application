import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getFriendsAndConversations,
  getFriendsAndRequests,
  respondToFriendRequest
} from "@chat/conversations/api/friendListApi"

export const friendListQueryKeys = {
  friendsAndRequests: ["friendList&Requests"] as const,
  friendConversations: ["friendConversations"] as const,
  userSearch: ["userSearch"] as const
}

export const useFriendsAndRequestsQuery = () =>
  useQuery({
    queryKey: friendListQueryKeys.friendsAndRequests,
    queryFn: getFriendsAndRequests
  })

export const useFriendConversationsQuery = (enabled = true) =>
  useQuery({
    queryKey: friendListQueryKeys.friendConversations,
    queryFn: getFriendsAndConversations,
    enabled
  })

export const useRespondFriendRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: respondToFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendListQueryKeys.friendsAndRequests })
      queryClient.invalidateQueries({ queryKey: friendListQueryKeys.friendConversations })
      queryClient.invalidateQueries({ queryKey: friendListQueryKeys.userSearch })
    },
    onError: (error: unknown) => {
      console.error("Error responding to friend request:", error)
    }
  })
}
