import { X } from "lucide-react"

const GroupModalHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="mb-4 flex items-center justify-between border-b pb-2">
    <h2 className="text-lg font-semibold text-gray-800">Create Group</h2>
    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close group modal">
      <X className="size-5" />
    </button>
  </div>
)

export default GroupModalHeader
