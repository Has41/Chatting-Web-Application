import { SlidersHorizontal } from "lucide-react"

interface ChatListHeaderProps {
  showDropdown: boolean
  onToggleDropdown: () => void
  onMakeGroup: () => void
}

const ChatListHeader = ({ showDropdown, onToggleDropdown, onMakeGroup }: ChatListHeaderProps) => (
  <div className="relative mb-4 flex items-center justify-between">
    <h2 className="text-xl font-semibold text-black/80">Chats</h2>
    <div className="relative">
      <button
        type="button"
        onClick={onToggleDropdown}
        className="focus:ring-custom-green inline-flex size-8 items-center justify-center rounded-full text-black/80 transition hover:bg-slate-100 focus:ring-2 focus:outline-none"
        aria-label="Open chat list menu"
        aria-expanded={showDropdown}
      >
        <SlidersHorizontal className="size-6" aria-hidden="true" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5">
          <button type="button" onClick={onMakeGroup} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
            Make Group
          </button>
        </div>
      )}
    </div>
  </div>
)

export default ChatListHeader
