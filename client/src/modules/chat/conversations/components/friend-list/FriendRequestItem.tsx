import { Check, X } from "lucide-react"
import UserAvatar from "@chat/conversations/components/friend-list/UserAvatar"
import type { FriendRequest, RespondFriendRequestPayload } from "@chat/conversations/types/friendList"

interface FriendRequestItemProps {
  request: FriendRequest
  onRespond: (payload: RespondFriendRequestPayload) => void
}

const FriendRequestItem = ({ request, onRespond }: FriendRequestItemProps) => {
  const user = request.from

  return (
    <li className="flex items-center justify-between gap-3 rounded px-2 py-2 hover:bg-gray-100">
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatar user={user} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.displayName || user.username}</p>
          <p className="truncate text-xs text-slate-500">@{user.username}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onRespond({ userId: user._id, response: "accepted" })}
          className="rounded-full bg-emerald-500 p-2 text-white hover:bg-emerald-600"
          aria-label={`Accept request from ${user.username}`}
        >
          <Check className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => onRespond({ userId: user._id, response: "rejected" })}
          className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
          aria-label={`Reject request from ${user.username}`}
        >
          <X className="size-4" />
        </button>
      </div>
    </li>
  )
}

export default FriendRequestItem
