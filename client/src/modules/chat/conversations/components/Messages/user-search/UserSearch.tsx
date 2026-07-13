import UserSearchInput from "./UserSearchInput"
import UserSearchResults from "./UserSearchResults"
import { useUserSearch } from "@chat/conversations/hooks/useUserSearch"

interface UserSearchProps {
  variant?: "dropdown" | "panel"
  placeholder?: string
  autoFocus?: boolean
}

const UserSearch = ({
  variant = "dropdown",
  placeholder = "Search people to start a chat",
  autoFocus = false
}: UserSearchProps) => {
  const isPanel = variant === "panel"
  const {
    handleClearSearch,
    handleSearchChange,
    isFetching,
    isSendingRequest,
    searchQuery,
    sendFriendRequest,
    shouldShowResults,
    userResults
  } = useUserSearch()

  return (
    <div className={`relative ${isPanel ? "mx-auto w-full max-w-xl" : "mx-auto mb-4 w-11/12"}`}>
      <UserSearchInput
        autoFocus={autoFocus}
        isPanel={isPanel}
        placeholder={placeholder}
        searchQuery={searchQuery}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />

      {shouldShowResults ? (
        <UserSearchResults
          isFetching={isFetching}
          isPanel={isPanel}
          isSendingRequest={isSendingRequest}
          userResults={userResults}
          onClearSearch={handleClearSearch}
          onSendFriendRequest={sendFriendRequest}
        />
      ) : isPanel ? (
        <p className="mt-3 text-center text-xs text-slate-500">Type at least 3 characters to find someone.</p>
      ) : null}
    </div>
  )
}

export default UserSearch
