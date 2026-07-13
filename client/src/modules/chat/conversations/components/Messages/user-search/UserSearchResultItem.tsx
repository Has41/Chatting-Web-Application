import { Check, Clock, MessageCircle, UserPlus, UserRound } from "lucide-react"
import { Link } from "react-router-dom"
import { getNewChatRoute } from "@shared/constants/routePaths"
import type { UserSearchResult } from "@chat/conversations/types/userSearch"

interface UserSearchResultItemProps {
  isSendingRequest: boolean
  result: UserSearchResult
  onClearSearch: () => void
  onSendFriendRequest: (userId: string) => void
}

const UserSearchResultItem = ({
  isSendingRequest,
  result,
  onClearSearch,
  onSendFriendRequest
}: UserSearchResultItemProps) => {
  const canSendRequest = !result.isFriend && !result.isRequestSent && !result.hasIncomingRequest
  const displayName = result.displayName || result.username

  return (
    <li className="flex items-center gap-2 rounded-md p-2 transition hover:bg-slate-100">
      <Link to={getNewChatRoute(result._id)} onClick={onClearSearch} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        {result.profilePicture?.url ? (
          <img src={result.profilePicture.url} alt={displayName} className="size-10 rounded-full object-cover" />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <UserRound className="size-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
            {result.isFriend && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-700">
                Friend
              </span>
            )}
          </div>
          <p className="truncate text-xs text-slate-500">@{result.username}</p>
        </div>

        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-white">
          <MessageCircle className="size-4" />
        </span>
      </Link>

      {canSendRequest ? (
        <button
          type="button"
          onClick={() => onSendFriendRequest(result._id)}
          disabled={isSendingRequest}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          title="Send friend request"
          aria-label={`Send friend request to ${result.username}`}
        >
          <UserPlus className="size-4" />
        </button>
      ) : result.isRequestSent ? (
        <span
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
          title="Friend request sent"
          aria-label="Friend request sent"
        >
          <Clock className="size-4" />
        </span>
      ) : result.hasIncomingRequest ? (
        <span
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700"
          title="They sent you a request"
          aria-label="Incoming friend request"
        >
          <Clock className="size-4" />
        </span>
      ) : (
        <span
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
          title="Already friends"
          aria-label="Already friends"
        >
          <Check className="size-4" />
        </span>
      )}
    </li>
  )
}

export default UserSearchResultItem
