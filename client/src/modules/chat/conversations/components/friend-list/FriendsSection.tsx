import FriendRow from "@chat/conversations/components/friend-list/FriendRow"
import type { User } from "@shared/types"

interface FriendsSectionProps {
  friends: User[]
  getFriendChatRoute: (friendId: string) => string
}

const FriendsSection = ({ friends, getFriendChatRoute }: FriendsSectionProps) => (
  <div className="mt-8 max-w-full">
    <div>
      <h1 className="mb-4 font-semibold text-black/80">All Friends</h1>
    </div>
    <div className="my-4 w-full">
      <ul className="space-y-4">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend._id}>
              <FriendRow friend={friend} to={getFriendChatRoute(friend._id)} />
            </li>
          ))
        ) : (
          <li className="rounded-md bg-slate-100 px-3 py-4 text-center text-sm text-gray-500">
            No friends yet. Search users and send a request.
          </li>
        )}
      </ul>
    </div>
  </div>
)

export default FriendsSection
