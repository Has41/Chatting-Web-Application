import { Loader2, LogOut, Trash2 } from "lucide-react"

interface ChannelDangerFooterProps {
  currentUserIsMember: boolean
  currentUserIsOwner: boolean
  leavePending: boolean
  deletePending: boolean
  onLeave: () => void
  onDelete: () => void
}

const ChannelDangerFooter = ({
  currentUserIsMember,
  currentUserIsOwner,
  leavePending,
  deletePending,
  onLeave,
  onDelete
}: ChannelDangerFooterProps) => (
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

export default ChannelDangerFooter
