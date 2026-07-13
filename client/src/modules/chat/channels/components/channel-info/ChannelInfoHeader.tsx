import { X } from "lucide-react"

interface ChannelInfoHeaderProps {
  currentUserIsAdmin: boolean
  onClose: () => void
}

const ChannelInfoHeader = ({ currentUserIsAdmin, onClose }: ChannelInfoHeaderProps) => (
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

export default ChannelInfoHeader
