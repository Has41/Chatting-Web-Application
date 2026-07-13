import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { searchUsers, sendFriendRequest } from "@chat/conversations/api/userSearchApi"
import { friendListQueryKeys } from "@chat/conversations/queries/friendListQueries"
import type { UserSearchResult } from "@chat/conversations/types/userSearch"

export const userSearchQueryKeys = {
  all: friendListQueryKeys.userSearch,
  results: (searchQuery: string) => [...friendListQueryKeys.userSearch, searchQuery] as const
}

export const useUserSearchQuery = (searchQuery: string) => {
  const trimmedQuery = searchQuery.trim()

  return useQuery({
    queryKey: userSearchQueryKeys.results(searchQuery),
    queryFn: () => searchUsers(trimmedQuery),
    enabled: trimmedQuery.length >= 3
  })
}

export const useSendFriendRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (_data: unknown, userId: string) => {
      queryClient.setQueriesData({ queryKey: userSearchQueryKeys.all }, (results: unknown) =>
        Array.isArray(results)
          ? results.map((result: UserSearchResult) =>
              result._id === userId ? { ...result, isRequestSent: true } : result
            )
          : results
      )
      queryClient.invalidateQueries({ queryKey: userSearchQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: friendListQueryKeys.friendsAndRequests })
    },
    onError: (error: unknown) => {
      console.error("Error sending friend request:", error)
    }
  })
}
