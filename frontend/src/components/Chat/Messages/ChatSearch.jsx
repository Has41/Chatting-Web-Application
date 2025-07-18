import { useState } from "react"
import { useMutation } from "react-query"
import SearchDropdown from "../../Shared/SearchDropdown"
import axiosInstance from "../../../utils/axiosInstance"
import { USER_PATHS } from "../../../constants/apiPaths"
import useAuth from "../../../hooks/useAuth"

const ChatSearch = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [conversationResults, setConversationResults] = useState([])
  const [friendResults, setfriendResults] = useState([])

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      return await axiosInstance.get(USER_PATHS.SEARCH_USER_CONVO_DATA, {
        params: { dataToSearch: data.dataToSearch }
      })
    },
    onSuccess: ({ data }) => {
      console.log("Search results:", data)
      setConversationResults(data.conversation || [])
      setfriendResults(data.friendsData || [])
    },
    onError: (error) => {
      setConversationResults([])
      setfriendResults([])
      if (import.meta.env.PROD) return
      console.error(error)
    }
  })

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value?.length < 3) {
      setConversationResults([])
      setfriendResults([])
      return
    }
    mutate({ dataToSearch: value })
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setConversationResults([])
    setfriendResults([])
  }

  return (
    <div className="relative mx-auto mb-4 w-11/12">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m2.7-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search messages or chats"
          className="w-full rounded bg-slate-100 p-2 pl-12 placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:ring focus:ring-blue-300"
          aria-label="Search Chats"
        />
      </div>

      {conversationResults.length > 0 && (
        <SearchDropdown
          conversationData={conversationResults}
          friendsData={friendResults}
          currentUserId={user?._id}
          onClear={handleClearSearch}
        />
      )}
    </div>
  )
}

export default ChatSearch
