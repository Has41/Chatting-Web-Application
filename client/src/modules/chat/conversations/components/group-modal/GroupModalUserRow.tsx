import type { User } from "@shared/types"

const FALLBACK_AVATAR_URL = "https://via.placeholder.com/40"

const GroupModalUserRow = ({
  user,
  checked,
  checkboxClassName,
  onToggle
}: {
  user: User
  checked: boolean
  checkboxClassName: string
  onToggle: () => void
}) => (
  <div className="flex items-center justify-between rounded px-3 py-2 hover:bg-gray-50">
    <div className="flex items-center space-x-3">
      <img
        src={user.profilePicture?.url || FALLBACK_AVATAR_URL}
        alt={user.username}
        className="h-8 w-8 rounded-full object-cover"
      />
      <span className="text-sm font-medium text-gray-800">{user.username}</span>
    </div>
    <input
      type="checkbox"
      aria-label={`Add ${user.username} to group`}
      checked={checked}
      onChange={onToggle}
      className={checkboxClassName}
    />
  </div>
)

export default GroupModalUserRow
