import { Crown, Loader2, Shield, ShieldMinus, ShieldPlus, UserMinus } from "lucide-react"
import type { User } from "@shared/types"
import type { GroupManagementAction } from "@chat/conversations/types/profileSidebar"

interface GroupMemberRowProps {
  member: User
  isOwner: boolean
  isAdmin: boolean
  currentUserIsOwner: boolean
  currentUserIsAdmin: boolean
  pendingAction: string | null
  onAction: (action: GroupManagementAction) => void
}

const GroupMemberRow = ({
  member,
  isOwner,
  isAdmin,
  currentUserIsOwner,
  currentUserIsAdmin,
  pendingAction,
  onAction
}: GroupMemberRowProps) => {
  const canManage = !isOwner && (currentUserIsOwner || (currentUserIsAdmin && !isAdmin))
  const isBusy = Boolean(pendingAction?.endsWith(`:${member._id}`))
  const avatarUrl = member.profilePicture?.url || member.avatar || ""

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg p-2 transition hover:bg-slate-50">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            (member.displayName || member.username || "U").charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{member.displayName || member.username}</p>
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

export default GroupMemberRow
