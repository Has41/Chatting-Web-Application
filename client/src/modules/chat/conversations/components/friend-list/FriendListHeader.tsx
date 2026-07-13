import { Bell } from "lucide-react"
import FriendRequestsPopover from "@chat/conversations/components/friend-list/FriendRequestsPopover"
import type { FriendRequest, RespondFriendRequestPayload } from "@chat/conversations/types/friendList"

interface FriendListHeaderProps {
  friendRequests: FriendRequest[]
  openNotification: boolean
  onToggleNotification: () => void
  onRespondFriendRequest: (payload: RespondFriendRequestPayload) => void
}

const FriendListHeader = ({
  friendRequests,
  openNotification,
  onToggleNotification,
  onRespondFriendRequest
}: FriendListHeaderProps) => (
  <div className="relative mb-4 flex items-center justify-between">
    <h2 className="text-xl font-semibold text-black/80">Friends</h2>
    <button
      type="button"
      onClick={onToggleNotification}
      className="relative rounded-full p-1 text-gray-500 transition hover:bg-slate-100 hover:text-gray-700"
      aria-label="Friend requests"
    >
      <Bell className="size-6" />
      {friendRequests.length > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[0.65rem] font-bold text-white">
          {friendRequests.length}
        </span>
      )}
    </button>
    {openNotification && (
      <FriendRequestsPopover friendRequests={friendRequests} onRespond={onRespondFriendRequest} />
    )}
  </div>
)

export default FriendListHeader
