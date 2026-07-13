import { MoreVertical, Pencil, Trash2 } from "lucide-react"

interface ChannelMessageActionsProps {
  canEditMessage: boolean
  showActions: boolean
  onToggleActions: () => void
  onOpenEditModal: () => void
  onDeleteMessage: () => void
}

const ChannelMessageActions = ({
  canEditMessage,
  showActions,
  onToggleActions,
  onOpenEditModal,
  onDeleteMessage
}: ChannelMessageActionsProps) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggleActions}
      className="grid size-7 place-items-center rounded-full text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-white hover:text-slate-700 focus:opacity-100 focus:ring-2 focus:ring-[#96e6a1] focus:outline-none"
      aria-label="Message actions"
    >
      <MoreVertical size={16} />
    </button>

    {showActions && (
      <div className="absolute top-8 right-0 z-20 min-w-32 overflow-hidden rounded-lg border border-slate-100 bg-white py-1 shadow-lg">
        {canEditMessage && (
          <button
            type="button"
            onClick={onOpenEditModal}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Pencil size={14} />
            Edit
          </button>
        )}
        <button
          type="button"
          onClick={onDeleteMessage}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    )}
  </div>
)

export default ChannelMessageActions
