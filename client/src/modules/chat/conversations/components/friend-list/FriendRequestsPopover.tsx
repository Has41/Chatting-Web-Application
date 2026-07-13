import FriendRequestItem from "@chat/conversations/components/friend-list/FriendRequestItem"
import type { FriendRequest, RespondFriendRequestPayload } from "@chat/conversations/types/friendList"

interface FriendRequestsPopoverProps {
  friendRequests: FriendRequest[]
  onRespond: (payload: RespondFriendRequestPayload) => void
}

const FriendRequestsPopover = ({ friendRequests, onRespond }: FriendRequestsPopoverProps) => (
  <div className="absolute top-full right-0 z-10 mt-2 w-72 rounded-md bg-white p-3 shadow-lg ring-1 ring-black/5">
    {friendRequests.length > 0 ? (
      <div>
        <h1 className="mb-4 font-semibold text-black/80">Friend Requests</h1>
        <ul className="space-y-3">
          {friendRequests.map((request) => (
            <FriendRequestItem key={request.from._id} request={request} onRespond={onRespond} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="px-3 py-2 text-sm text-gray-500 italic">No new friend requests</div>
    )}
  </div>
)

export default FriendRequestsPopover
