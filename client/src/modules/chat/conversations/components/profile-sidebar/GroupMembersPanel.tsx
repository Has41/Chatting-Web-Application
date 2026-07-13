import MemberSearchInput from "./MemberSearchInput"
import GroupMemberRow from "./GroupMemberRow"
import type { ChangeEvent } from "react"
import type { User } from "@shared/types"
import type { GroupManagementAction } from "@chat/conversations/types/profileSidebar"

const GroupMembersPanel = ({
  enabled,
  memberCount,
  members,
  searchQuery,
  ownerId,
  adminIds,
  currentUserIsOwner,
  currentUserIsAdmin,
  pendingAction,
  onSearchChange,
  onMemberAction
}: {
  enabled: boolean
  memberCount: number
  members: User[]
  searchQuery: string
  ownerId?: string
  adminIds: Set<string>
  currentUserIsOwner: boolean
  currentUserIsAdmin: boolean
  pendingAction: string | null
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void
  onMemberAction: (action: GroupManagementAction, member: User) => void
}) => {
  if (!enabled) return null

  return (
    <div className="mt-6 max-h-[35%] overflow-y-auto border-t px-4 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-md font-semibold">Members ({memberCount})</h4>
        {currentUserIsAdmin && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Admin tools</span>
        )}
      </div>

      <MemberSearchInput searchQuery={searchQuery} onSearchChange={onSearchChange} />

      {members.length > 0 ? (
        <ul className="space-y-2">
          {members.map((member) => (
            <GroupMemberRow
              key={member._id}
              member={member}
              isOwner={ownerId === member._id}
              isAdmin={adminIds.has(member._id) || ownerId === member._id}
              currentUserIsOwner={currentUserIsOwner}
              currentUserIsAdmin={currentUserIsAdmin}
              pendingAction={pendingAction}
              onAction={(action) => onMemberAction(action, member)}
            />
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-sm text-gray-500">No members found</p>
      )}
    </div>
  )
}

export default GroupMembersPanel
