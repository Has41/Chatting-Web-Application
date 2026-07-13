import GroupModalUserRow from "./GroupModalUserRow"
import { getOtherConversationParticipant } from "@chat/conversations/utils/groupModal"
import type { User } from "@shared/types"
import type { FriendConversation } from "@chat/conversations/types/groupModal"

const GroupModalMemberSections = ({
  currentUserId,
  friends,
  conversations,
  selectedIdSet,
  onToggleUser
}: {
  currentUserId?: string
  friends: User[]
  conversations: FriendConversation[]
  selectedIdSet: Set<string>
  onToggleUser: (userId: string) => void
}) => (
  <div className="max-h-64 space-y-2 overflow-y-auto">
    {friends.length > 0 && (
      <>
        <h4 className="px-1 text-xs font-bold text-gray-500">Friends</h4>
        {friends.map((friend) => (
          <GroupModalUserRow
            key={friend._id}
            user={friend}
            checked={selectedIdSet.has(friend._id)}
            onToggle={() => onToggleUser(friend._id)}
            checkboxClassName="form-checkbox accent-custom-text h-4 w-4 cursor-pointer"
          />
        ))}
      </>
    )}

    {conversations.length > 0 && (
      <>
        <h4 className="mt-4 px-1 text-xs font-bold text-gray-500">From Conversations</h4>
        {conversations.map((conversation) => {
          const other = getOtherConversationParticipant(conversation, currentUserId)
          if (!other) return null

          return (
            <GroupModalUserRow
              key={other._id}
              user={other}
              checked={selectedIdSet.has(other._id)}
              onToggle={() => onToggleUser(other._id)}
              checkboxClassName="text-custom-text h-4 w-4 accent-green-500 focus:ring-green-500"
            />
          )
        })}
      </>
    )}
  </div>
)

export default GroupModalMemberSections
