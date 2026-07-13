import { useEffect, useState, type ChangeEvent } from "react"
import { useSendFriendRequestMutation, useUserSearchQuery } from "@chat/conversations/queries/userSearchQueries"

export const useUserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: searchData, error: searchError, isFetching } = useUserSearchQuery(searchQuery)
  const { mutate: sendFriendRequest, isPending: isSendingRequest } = useSendFriendRequestMutation()

  useEffect(() => {
    if (!searchError) return
    console.error("Error fetching user search results:", searchError)
  }, [searchError])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  return {
    handleClearSearch,
    handleSearchChange,
    isFetching,
    isSendingRequest,
    searchQuery,
    sendFriendRequest,
    shouldShowResults: searchQuery.trim().length >= 3,
    userResults: searchData ?? []
  }
}
