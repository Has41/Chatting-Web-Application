import SearchDropdown from "@chat/navigation/components/SearchDropdown"
import useAuth from "@auth/hooks/useAuth"
import { Search } from "lucide-react"
import { useChatSearch } from "@chat/conversations/hooks/useChatSearch"

const ChatSearch = () => {
  const { user } = useAuth()
  const { conversationResults, friendResults, handleClearSearch, handleSearch, searchQuery } = useChatSearch()

  return (
    <div className="relative mx-auto mb-4 w-11/12">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search messages or chats"
          className="w-full rounded bg-slate-100 p-2 pl-12 placeholder:text-sm placeholder:text-slate-400 focus:ring focus:ring-blue-300 focus:outline-none"
          aria-label="Search Chats"
        />
      </div>

      {conversationResults.length > 0 && (
        <SearchDropdown
          conversationData={conversationResults}
          friendsData={friendResults}
          currentUserId={user?._id ?? ""}
          onClear={handleClearSearch}
        />
      )}
    </div>
  )
}

export default ChatSearch
