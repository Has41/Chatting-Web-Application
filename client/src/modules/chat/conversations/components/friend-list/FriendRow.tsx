import { Link } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import UserAvatar from "@chat/conversations/components/friend-list/UserAvatar"
import type { User } from "@shared/types"

interface FriendRowProps {
  friend: User
  to: string
}

const FriendRow = ({ friend, to }: FriendRowProps) => (
  <Link to={to} className="flex cursor-pointer items-center rounded p-2 transition-all duration-300 hover:bg-gray-100">
    <UserAvatar user={friend} className="mr-4" />
    <div className="min-w-0 flex-1">
      <p className="truncate font-semibold text-gray-800">{friend.displayName || friend.username}</p>
      <p className="truncate text-xs text-slate-500">@{friend.username}</p>
    </div>
    <MessageCircle className="ml-auto size-5 text-slate-400" />
  </Link>
)

export default FriendRow
