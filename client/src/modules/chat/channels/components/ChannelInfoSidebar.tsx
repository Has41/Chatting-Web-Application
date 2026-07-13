import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction
} from "react"
import {
  Check,
  Crown,
  Hash,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Save,
  Search,
  Shield,
  ShieldMinus,
  ShieldPlus,
  Trash2,
  Users,
  UserMinus,
  UserRound,
  X
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import useAuth from "@auth/hooks/useAuth"
import axiosInstance from "@shared/api/api-client"
import { USER_PATHS } from "@shared/constants/apiPaths"
import { CHAT_PAGE } from "@shared/constants/routePaths"
import type { Channel, User } from "@shared/types"
import {
  useAddChannelMembers,
  useDeleteChannel,
  useDemoteChannelAdmin,
  useLeaveChannel,
  usePromoteChannelAdmin,
  useRemoveChannelMembers,
  useTransferChannelOwnership,
  useUpdateChannel
} from "../queries/useChannels"
import ChannelInfoFiles from "./ChannelInfoFiles"

const getUserId = (value?: User | string | null) => (typeof value === "string" ? value : value?._id)

const getUserLabel = (user: User) => user.displayName || user.username || "Member"

const getChannelDraft = (channel: Channel) => ({
  channelId: channel._id,
  name: channel.name,
  description: channel.description || "",
  visibility: channel.visibility,
  sendPermissions: channel.sendPermissions || "admins"
})

const EMPTY_SEARCH_RESULTS: UserSearchResult[] = []

interface ChannelInfoSidebarProps {
  isOpen: boolean
  onClose: () => void
  channel: Channel
}

const ChannelInfoSidebar = ({ isOpen, onClose, channel }: ChannelInfoSidebarProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [draft, setDraft] = useState(() => getChannelDraft(channel))
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [showAddMembers, setShowAddMembers] = useState(false)
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null)

  const updateChannel = useUpdateChannel()
  const addMembers = useAddChannelMembers()
  const leaveChannel = useLeaveChannel()
  const deleteChannel = useDeleteChannel()
  const removeMember = useRemoveChannelMembers()
  const transferOwnership = useTransferChannelOwnership()
  const promoteAdmin = usePromoteChannelAdmin()
  const demoteAdmin = useDemoteChannelAdmin()

  const ownerId = getUserId(channel.owner)
  const currentUserId = user?._id
  const adminIds = useMemo(
    () => new Set(channel.admins.flatMap((admin) => (getUserId(admin) ? [getUserId(admin) as string] : []))),
    [channel.admins]
  )
  const currentUserIsOwner = Boolean(currentUserId && currentUserId === ownerId)
  const currentUserIsAdmin = Boolean(currentUserId && (currentUserIsOwner || adminIds.has(currentUserId)))
  const currentUserIsMember = Boolean(currentUserId && channel.members.some((member) => getUserId(member) === currentUserId))
  const members = useMemo(
    () =>
      channel.members
        .filter((member): member is User => typeof member !== "string")
        .sort((first, second) => Number(getUserId(second) === ownerId) - Number(getUserId(first) === ownerId)),
    [channel.members, ownerId]
  )

  const VisibilityIcon = channel.visibility === "private" ? Lock : Hash
  const isSaving = updateChannel.isPending

  if (draft.channelId !== channel._id) {
    setDraft(getChannelDraft(channel))
  }

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentUserIsAdmin || !draft.name.trim()) return

    updateChannel.mutate({
      channelId: channel._id,
      payload: {
        name: draft.name.trim(),
        description: draft.description.trim(),
        visibility: draft.visibility,
        sendPermissions: draft.sendPermissions
      }
    })
  }

  const executeMemberAction = useCallback(
    async (action: "remove" | "transfer" | "promote" | "demote", target: User) => {
      const actionKey = `${action}:${target._id}`
      setPendingAction(actionKey)

      try {
        if (action === "remove") {
          await removeMember.mutateAsync({ channelId: channel._id, members: [target._id] })
        } else if (action === "transfer") {
          await transferOwnership.mutateAsync({ channelId: channel._id, newOwnerId: target._id })
        } else if (action === "promote") {
          await promoteAdmin.mutateAsync({ channelId: channel._id, targetUserId: target._id })
        } else {
          await demoteAdmin.mutateAsync({ channelId: channel._id, targetUserId: target._id })
        }
      } finally {
        setPendingAction(null)
      }
    },
    [channel._id, demoteAdmin, promoteAdmin, removeMember, transferOwnership]
  )

  const handleMemberAction = (action: "remove" | "transfer" | "promote" | "demote", target: User) => {
    if (action === "promote" || action === "demote") {
      void executeMemberAction(action, target)
      return
    }

    if (action === "remove") {
      setConfirmation({
        title: "Remove member?",
        description: `${getUserLabel(target)} will lose access to ${channel.name} unless an admin adds them again.`,
        confirmLabel: "Remove",
        tone: "danger",
        action: { type: "member", memberAction: action, target }
      })
      return
    }

    if (action === "transfer") {
      setConfirmation({
        title: "Transfer ownership?",
        description: `${getUserLabel(target)} will become the owner of ${channel.name}. You will remain a member unless they remove you later.`,
        confirmLabel: "Transfer",
        tone: "warning",
        action: { type: "member", memberAction: action, target }
      })
      return
    }
  }

  const handleLeave = async () => {
    setConfirmation({
      title: "Leave channel?",
      description: `You will leave ${channel.name} and lose access unless someone adds you again.`,
      confirmLabel: "Leave",
      tone: "warning",
      action: { type: "leave" }
    })
  }

  const handleDelete = async () => {
    setConfirmation({
      title: "Delete channel?",
      description: `${channel.name} and its messages will be deleted. This cannot be undone.`,
      confirmLabel: "Delete",
      tone: "danger",
      action: { type: "delete" }
    })
  }

  const handleConfirmAction = async (nextConfirmation: ConfirmationState) => {
    if (nextConfirmation.action.type === "member") {
      await executeMemberAction(nextConfirmation.action.memberAction, nextConfirmation.action.target)
      return
    }

    if (nextConfirmation.action.type === "leave") {
      await leaveChannel.mutateAsync(channel._id)
      onClose()
      navigate(CHAT_PAGE)
      return
    }

    await deleteChannel.mutateAsync(channel._id)
    onClose()
    navigate(CHAT_PAGE)
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-black/10"
          onClick={onClose}
          aria-label="Close channel info"
        />
      )}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-108 max-w-[92vw] transform flex-col bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ChannelInfoHeader currentUserIsAdmin={currentUserIsAdmin} onClose={onClose} />

        <div className="flex-1 overflow-y-auto">
          <ChannelDetailsSection
            channel={channel}
            VisibilityIcon={VisibilityIcon}
            draft={draft}
            currentUserIsAdmin={currentUserIsAdmin}
            isSaving={isSaving}
            onDraftChange={setDraft}
            onSave={handleSave}
          />

          <ChannelInfoFiles channelId={channel._id} />

          <ChannelMembersSection
            members={members}
            memberCount={channel.members.length}
            ownerId={ownerId}
            adminIds={adminIds}
            currentUserIsOwner={currentUserIsOwner}
            currentUserIsAdmin={currentUserIsAdmin}
            pendingAction={pendingAction}
            onAddMembers={() => setShowAddMembers(true)}
            onMemberAction={handleMemberAction}
          />
        </div>

        <ChannelDangerFooter
          currentUserIsMember={currentUserIsMember}
          currentUserIsOwner={currentUserIsOwner}
          leavePending={leaveChannel.isPending}
          deletePending={deleteChannel.isPending}
          onLeave={handleLeave}
          onDelete={handleDelete}
        />

        {showAddMembers && (
          <AddChannelMembersModal
            channel={channel}
            isAdding={addMembers.isPending}
            onClose={() => setShowAddMembers(false)}
            onAdd={async (memberIds) => {
              await addMembers.mutateAsync({ channelId: channel._id, members: memberIds })
              setShowAddMembers(false)
            }}
          />
        )}
        {confirmation && (
          <ConfirmationModal
            confirmation={confirmation}
            onClose={() => setConfirmation(null)}
            onConfirm={handleConfirmAction}
          />
        )}
      </aside>
    </>
  )
}

type ChannelDraft = ReturnType<typeof getChannelDraft>

const ChannelInfoHeader = ({ currentUserIsAdmin, onClose }: { currentUserIsAdmin: boolean; onClose: () => void }) => (
  <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Channel Info</h2>
      <p className="text-xs text-slate-500">
        {currentUserIsAdmin ? "Manage channel details and roles" : "View channel details"}
      </p>
    </div>
    <button
      type="button"
      onClick={onClose}
      className="grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 focus:ring-2 focus:ring-[#96e6a1] focus:outline-none"
      aria-label="Close"
    >
      <X size={18} />
    </button>
  </header>
)

const ChannelDetailsSection = ({
  channel,
  VisibilityIcon,
  draft,
  currentUserIsAdmin,
  isSaving,
  onDraftChange,
  onSave
}: {
  channel: Channel
  VisibilityIcon: typeof Hash
  draft: ChannelDraft
  currentUserIsAdmin: boolean
  isSaving: boolean
  onDraftChange: Dispatch<SetStateAction<ChannelDraft>>
  onSave: (event: FormEvent<HTMLFormElement>) => void
}) => (
  <section className="px-5 py-5 text-center">
    <div className="mx-auto grid size-24 place-items-center overflow-hidden rounded-full bg-[#e5f8e8] text-[#2f733c]">
      {channel.avatar?.url ? (
        <img src={channel.avatar.url} alt="" className="h-full w-full object-cover" />
      ) : (
        <VisibilityIcon size={34} />
      )}
    </div>
    <form onSubmit={onSave} className="mt-5 space-y-3 text-left">
      <label className="block">
        <span className="text-xs font-semibold text-slate-500">Name</span>
        <input
          value={draft.name}
          onChange={(event) => onDraftChange((current) => ({ ...current, name: event.target.value }))}
          disabled={!currentUserIsAdmin}
          className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-900 transition outline-none focus:border-[#96e6a1] focus:ring-2 focus:ring-[#96e6a1]/40 disabled:bg-slate-50 disabled:text-slate-600"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold text-slate-500">Description</span>
        <textarea
          value={draft.description}
          onChange={(event) => onDraftChange((current) => ({ ...current, description: event.target.value }))}
          disabled={!currentUserIsAdmin}
          rows={3}
          className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 transition outline-none focus:border-[#96e6a1] focus:ring-2 focus:ring-[#96e6a1]/40 disabled:bg-slate-50 disabled:text-slate-600"
          placeholder="No description"
        />
      </label>

      <VisibilitySegmentedControl
        visibility={draft.visibility}
        disabled={!currentUserIsAdmin}
        onChange={(visibility) => onDraftChange((current) => ({ ...current, visibility }))}
      />

      <SendPermissionControl
        sendPermissions={draft.sendPermissions}
        disabled={!currentUserIsAdmin}
        onChange={(sendPermissions) => onDraftChange((current) => ({ ...current, sendPermissions }))}
      />

      {currentUserIsAdmin && (
        <button
          type="submit"
          disabled={isSaving || !draft.name.trim()}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#96e6a1] text-sm font-semibold text-[#102315] transition hover:bg-[#86dc92] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save channel
        </button>
      )}
    </form>
  </section>
)

const VisibilitySegmentedControl = ({
  visibility,
  disabled,
  onChange
}: {
  visibility: ChannelDraft["visibility"]
  disabled: boolean
  onChange: (visibility: ChannelDraft["visibility"]) => void
}) => (
  <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-semibold text-slate-600">
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange("public")}
      className={`rounded-md px-3 py-2 transition disabled:cursor-not-allowed ${
        visibility === "public" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
      }`}
    >
      Public
    </button>
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange("private")}
      className={`rounded-md px-3 py-2 transition disabled:cursor-not-allowed ${
        visibility === "private" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
      }`}
    >
      Private
    </button>
  </div>
)

const SendPermissionControl = ({
  sendPermissions,
  disabled,
  onChange
}: {
  sendPermissions: ChannelDraft["sendPermissions"]
  disabled: boolean
  onChange: (sendPermissions: ChannelDraft["sendPermissions"]) => void
}) => (
  <div className="rounded-lg border border-slate-200 p-3">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">Who can send?</p>
        <p className="mt-0.5 text-xs text-slate-500">Channels usually keep posting to admins.</p>
      </div>
      <Shield size={18} className="shrink-0 text-green-600" />
    </div>
    <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-semibold text-slate-600">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("admins")}
        className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 transition disabled:cursor-not-allowed ${
          sendPermissions === "admins" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
        }`}
      >
        <Shield size={15} />
        Admins
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("members")}
        className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 transition disabled:cursor-not-allowed ${
          sendPermissions === "members" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
        }`}
      >
        <Users size={15} />
        Members
      </button>
    </div>
  </div>
)

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
}: {
  members: User[]
  memberCount: number
  ownerId?: string
  adminIds: Set<string>
  currentUserIsOwner: boolean
  currentUserIsAdmin: boolean
  pendingAction: string | null
  onAddMembers: () => void
  onMemberAction: (action: "remove" | "transfer" | "promote" | "demote", target: User) => void
}) => (
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

const ChannelDangerFooter = ({
  currentUserIsMember,
  currentUserIsOwner,
  leavePending,
  deletePending,
  onLeave,
  onDelete
}: {
  currentUserIsMember: boolean
  currentUserIsOwner: boolean
  leavePending: boolean
  deletePending: boolean
  onLeave: () => void
  onDelete: () => void
}) => (
  <footer className="border-t border-slate-100 p-5">
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onLeave}
        disabled={!currentUserIsMember || currentUserIsOwner || leavePending}
        className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {leavePending ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
        Leave
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={!currentUserIsOwner || deletePending}
        className="flex h-10 items-center justify-center gap-2 rounded-lg bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deletePending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        Delete
      </button>
    </div>
  </footer>
)

type ConfirmationAction =
  | { type: "member"; memberAction: "remove" | "transfer" | "promote" | "demote"; target: User }
  | { type: "leave" }
  | { type: "delete" }

interface ConfirmationState {
  title: string
  description: string
  confirmLabel: string
  tone: "warning" | "danger"
  action: ConfirmationAction
}

const ConfirmationModal = ({
  confirmation,
  onClose,
  onConfirm
}: {
  confirmation: ConfirmationState
  onClose: () => void
  onConfirm: (confirmation: ConfirmationState) => Promise<void>
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [isWorking, setIsWorking] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog?.open) dialog?.showModal()
  }, [])

  const handleConfirm = async () => {
    setIsWorking(true)
    try {
      await onConfirm(confirmation)
      onClose()
    } finally {
      setIsWorking(false)
    }
  }

  const danger = confirmation.tone === "danger"

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-full max-w-sm bg-transparent p-4 backdrop:bg-black/45 backdrop:backdrop-blur-sm"
      aria-label={confirmation.title}
      onClose={onClose}
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-2xl">
        <div
          className={`mb-4 grid size-11 place-items-center rounded-full ${danger ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}
        >
          {danger ? <Trash2 size={20} /> : <Crown size={20} />}
        </div>
        <h3 className="text-base font-semibold text-slate-900">{confirmation.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{confirmation.description}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isWorking}
            className="h-10 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isWorking}
            className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              danger ? "bg-red-600 text-white hover:bg-red-500" : "bg-[#96e6a1] text-[#102315] hover:bg-[#86dc92]"
            }`}
          >
            {isWorking && <Loader2 size={15} className="animate-spin" />}
            {confirmation.confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}

interface ChannelMemberRowProps {
  member: User
  isOwner: boolean
  isAdmin: boolean
  currentUserIsOwner: boolean
  currentUserIsAdmin: boolean
  pendingAction: string | null
  onAction: (action: "remove" | "transfer" | "promote" | "demote") => void
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

interface UserSearchResult extends User {
  isFriend?: boolean
}

interface AddChannelMembersModalProps {
  channel: Channel
  isAdding: boolean
  onClose: () => void
  onAdd: (memberIds: string[]) => Promise<void>
}

const AddChannelMembersModal = ({ channel, isAdding, onClose, onAdd }: AddChannelMembersModalProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [query, setQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const memberIds = useMemo(
    () => new Set(channel.members.flatMap((member) => (getUserId(member) ? [getUserId(member) as string] : []))),
    [channel.members]
  )
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const { data, isFetching, error } = useQuery({
    queryKey: ["channelMemberSearch", query],
    queryFn: async () => {
      const response = await axiosInstance.get<UserSearchResult[]>(USER_PATHS.SEARCH_FRIENDS_USERS, {
        params: { dataToSearch: query.trim() }
      })
      return response.data
    },
    enabled: query.trim().length >= 3
  })
  const searchResults: UserSearchResult[] = data ?? EMPTY_SEARCH_RESULTS

  useEffect(() => {
    if (!error) return
    console.error("Channel member search failed:", error)
  }, [error])

  const candidates = useMemo(
    () => searchResults.filter((candidate) => !memberIds.has(candidate._id)),
    [searchResults, memberIds]
  )

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    if (event.target.value.trim().length < 3) setSelectedIds([])
  }

  const toggleSelected = (userId: string) => {
    setSelectedIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleAdd = async () => {
    if (selectedIds.length === 0) return
    await onAdd(selectedIds)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog?.open) dialog?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-full max-w-lg bg-transparent p-4 backdrop:bg-black/45 backdrop:backdrop-blur-sm"
      aria-label="Add channel members"
      onClose={onClose}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Add members</h3>
            <p className="text-xs text-slate-500">Invite people into {channel.name}.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 focus:ring-2 focus:ring-[#96e6a1] focus:outline-none"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="p-5">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={handleSearchChange}
              autoFocus
              placeholder="Search by username or display name"
              className="h-12 w-full rounded-lg border border-slate-200 bg-white pr-4 pl-11 text-sm text-slate-800 transition outline-none placeholder:text-slate-400 focus:border-[#96e6a1] focus:ring-2 focus:ring-[#96e6a1]/40"
            />
          </label>

          <div className="mt-4 max-h-80 overflow-y-auto">
            {query.trim().length < 3 ? (
              <p className="py-8 text-center text-sm text-slate-500">Type at least 3 characters to find people.</p>
            ) : isFetching ? (
              <div className="space-y-2">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="flex animate-pulse items-center gap-3 rounded-lg p-2">
                    <div className="size-10 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/2 rounded bg-slate-200" />
                      <div className="h-2 w-1/3 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : candidates.length > 0 ? (
              <ul className="space-y-1">
                {candidates.map((candidate) => {
                  const selected = selectedIdSet.has(candidate._id)
                  const avatarUrl = candidate.profilePicture?.url || candidate.avatar || ""

                  return (
                    <li key={candidate._id}>
                      <button
                        type="button"
                        onClick={() => toggleSelected(candidate._id)}
                        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition ${
                          selected ? "bg-green-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <UserRound size={19} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-slate-800">{getUserLabel(candidate)}</p>
                            {candidate.isFriend && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-700">
                                Friend
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-slate-500">@{candidate.username}</p>
                        </div>
                        <span
                          className={`grid size-8 place-items-center rounded-full ${
                            selected ? "bg-[#96e6a1] text-[#102315]" : "border border-slate-200 text-slate-400"
                          }`}
                        >
                          {selected ? <Check size={16} /> : <Plus size={16} />}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">No users found outside this channel.</p>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
          <p className="text-xs font-medium text-slate-500">
            {selectedIds.length} {selectedIds.length === 1 ? "person" : "people"} selected
          </p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={selectedIds.length === 0 || isAdding}
            className="flex h-10 min-w-32 items-center justify-center gap-2 rounded-lg bg-[#96e6a1] px-4 text-sm font-semibold text-[#102315] transition hover:bg-[#86dc92] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Add members
          </button>
        </footer>
      </div>
    </dialog>
  )
}

export default ChannelInfoSidebar
