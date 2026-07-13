import { useState, type ChangeEvent } from "react"
import { useChatSearchMutation } from "@chat/conversations/queries/chatSearchQueries"
import type { SearchConversation, SearchFriend } from "@chat/navigation/types/search"

export const useChatSearch = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversationResults, setConversationResults] = useState<SearchConversation[]>([])
  const [friendResults, setFriendResults] = useState<SearchFriend[]>([])

  const clearResults = () => {
    setConversationResults([])
    setFriendResults([])
  }

  const { mutate } = useChatSearchMutation({
    onSuccess: (data) => {
      setConversationResults(data.conversation ?? [])
      setFriendResults(data.friendsData ?? [])
    },
    onError: (error) => {
      clearResults()
      if (import.meta.env.PROD) return
      console.error(error)
    }
  })

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length < 3) {
      clearResults()
      return
    }

    mutate({ dataToSearch: value })
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    clearResults()
  }

  return {
    conversationResults,
    friendResults,
    handleClearSearch,
    handleSearch,
    searchQuery
  }
}
