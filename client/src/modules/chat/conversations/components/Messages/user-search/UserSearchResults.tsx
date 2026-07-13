import { X } from "lucide-react"
import UserSearchResultItem from "@chat/conversations/components/messages/user-search/UserSearchResultItem"
import UserSearchSkeleton from "@chat/conversations/components/messages/user-search/UserSearchSkeleton"
import type { UserSearchResult } from "@chat/conversations/types/userSearch"

interface UserSearchResultsProps {
  isFetching: boolean
  isPanel: boolean
  isSendingRequest: boolean
  userResults: UserSearchResult[]
  onClearSearch: () => void
  onSendFriendRequest: (userId: string) => void
}

const UserSearchResults = ({
  isFetching,
  isPanel,
  isSendingRequest,
  userResults,
  onClearSearch,
  onSendFriendRequest
}: UserSearchResultsProps) => (
  <div className={isPanel ? "mt-4" : "absolute top-full right-0 left-0 z-10 mt-3 rounded-md bg-white p-3 shadow-lg"}>
    <div className="flex items-center justify-between border-b border-slate-200 px-2 py-2">
      <h3 className="text-sm font-semibold text-slate-800">People</h3>
      {!isPanel && (
        <button type="button" className="text-slate-500 hover:text-slate-700" onClick={onClearSearch} aria-label="Clear search">
          <X className="size-4" />
        </button>
      )}
    </div>

    {isFetching ? (
      <UserSearchSkeleton />
    ) : userResults.length > 0 ? (
      <ul className={isPanel ? "max-h-72 overflow-y-auto py-2" : "max-h-80 overflow-y-auto py-2"}>
        {userResults.map((result) => (
          <UserSearchResultItem
            key={result._id}
            isSendingRequest={isSendingRequest}
            result={result}
            onClearSearch={onClearSearch}
            onSendFriendRequest={onSendFriendRequest}
          />
        ))}
      </ul>
    ) : (
      <div className="px-3 py-6 text-center text-sm text-slate-500">No matching users found</div>
    )}
  </div>
)

export default UserSearchResults
