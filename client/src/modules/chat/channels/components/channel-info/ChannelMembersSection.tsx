import { Crown, Loader2, Plus, Shield, ShieldMinus, ShieldPlus, UserMinus } from "lucide-react"
import type { User } from "@shared/types"
import type { MemberAction } from "../../types/channelInfo"
import { getUserId, getUserLabel } from "../../utils/channelInfo"

interface ChannelMembersSectionProps {
  members: User[]
  memberCount: number
  ownerId?: string
  adminIds: Set<string>
  currentUserIsOwner: boolean
  currentUserIsAdmin: boolean
  pendingAction: string | null
  onAddMembers: () => void
  onMemberAction: (memberAction: MemberAction, target: User) => void
}

const ChannelMembersSection = ({
  members,
  memberCount,
  ownerId,
  adminIds,
  currentUserIsOwner,
  currentUserIsAdmin,
  pendingAction,
  onAddMembers,
  onMemberAction
}: ChannelMembersSectionProps) => (
  <section className="border-t border-slate-100 px-5 py-5">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-900">Members ({memberCount})</h3>
      <div className="flex items-center gap-2">
        {currentUserIsAdmin && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Admin tools</span>
        )}
        {currentUserIsAdmin && (
          <button
            type="button"
            onClick={onAddMembers}
            className="grid size-8 place-items-center rounded-full bg-[#96e6a1] text-[#102315] transition hover:bg-[#86dc92] focus:ring-2 focus:ring-[#96e6a1] focus:outline-none"
            aria-label="Add channel members"
            title="Add members"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
    </div>
    <ul className="space-y-2">
      {members.map((member) => (
        <ChannelMemberRow
          key={member._id}
          member={member}
          isOwner={getUserId(member) === ownerId}
          isAdmin={adminIds.has(member._id) || getUserId(member) === ownerId}
          currentUserIsOwner={currentUserIsOwner}
          currentUserIsAdmin={currentUserIsAdmin}
          pendingAction={pendingAction}
          onAction={(action) => onMemberAction(action, member)}
        />
      ))}
    </ul>
  </section>
)

interface ChannelMemberRowProps {
  member: User
  isOwner: boolean
  isAdmin: boolean
  currentUserIsOwner: boolean
  currentUserIsAdmin: boolean
  pendingAction: string | null
  onAction: (memberAction: MemberAction) => void
}

const ChannelMemberRow = ({
  member,
  isOwner,
  isAdmin,
  currentUserIsOwner,
  currentUserIsAdmin,
  pendingAction,
  onAction
}: ChannelMemberRowProps) => {
  const canManage = !isOwner && (currentUserIsOwner || (currentUserIsAdmin && !isAdmin))
  const isBusy = Boolean(pendingAction?.endsWith(`:${member._id}`))
  const avatarUrl = member.profilePicture?.url || member.avatar || ""

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg p-2 transition hover:bg-slate-50">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            getUserLabel(member).charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{getUserLabel(member)}</p>
          <p className="truncate text-xs text-slate-500">@{member.username}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {isOwner ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
            <Crown size={12} />
            Owner
          </span>
        ) : isAdmin ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700">
            <Shield size={12} />
            Admin
          </span>
        ) : null}

        {isBusy && <Loader2 size={16} className="animate-spin text-green-600" />}

        {!isBusy && canManage && (
          <>
            {currentUserIsOwner && (
              <button
                type="button"
                onClick={() => onAction("transfer")}
                className="grid size-8 place-items-center rounded-full text-amber-700 transition hover:bg-amber-50 focus:ring-2 focus:ring-amber-300 focus:outline-none"
                title="Transfer ownership"
                aria-label={`Transfer ownership to ${member.username}`}
              >
                <Crown size={16} />
              </button>
            )}
            {currentUserIsOwner && (
              <button
                type="button"
                onClick={() => onAction(isAdmin ? "demote" : "promote")}
                className="grid size-8 place-items-center rounded-full text-green-700 transition hover:bg-green-50 focus:ring-2 focus:ring-green-300 focus:outline-none"
                title={isAdmin ? "Remove admin" : "Make admin"}
                aria-label={isAdmin ? `Remove ${member.username} as admin` : `Make ${member.username} an admin`}
              >
                {isAdmin ? <ShieldMinus size={16} /> : <ShieldPlus size={16} />}
              </button>
            )}
            <button
              type="button"
              onClick={() => onAction("remove")}
              className="grid size-8 place-items-center rounded-full text-red-600 transition hover:bg-red-50 focus:ring-2 focus:ring-red-200 focus:outline-none"
              title="Remove member"
              aria-label={`Remove ${member.username}`}
            >
              <UserMinus size={16} />
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default ChannelMembersSection
