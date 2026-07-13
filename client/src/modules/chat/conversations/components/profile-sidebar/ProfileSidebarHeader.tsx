import { X } from "lucide-react"

const ProfileSidebarHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div className="flex items-center justify-between border-b p-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close chat info">
      <X className="size-5" />
    </button>
  </div>
)

export default ProfileSidebarHeader
