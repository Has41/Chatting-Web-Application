import { Pencil } from "lucide-react"
import StatusDropdown from "@shared/components/StatusDropdown"
import type { User } from "@shared/types"

interface SettingsProfileHeaderProps {
  user: User | null
}

const SettingsProfileHeader = ({ user }: SettingsProfileHeaderProps) => {
  const profilePictureUrl = user?.profilePicture?.url
  const fallbackInitial = user?.username?.charAt(0).toUpperCase() || "U"

  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="relative">
        {profilePictureUrl ? (
          <img src={profilePictureUrl} alt="Profile" className="h-20 w-20 rounded-full border-2 border-white shadow" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-xl font-semibold text-white shadow">
            {fallbackInitial}
          </div>
        )}
        <button
          type="button"
          className="absolute right-1 bottom-1 rounded-full border border-gray-300 bg-gray-100 p-1 shadow-sm hover:bg-gray-200"
          aria-label="Change Profile Picture"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-gray-800">{user?.username}</h3>
      <div className="flex items-center justify-center gap-x-1">
        <StatusDropdown />
      </div>
    </div>
  )
}

export default SettingsProfileHeader
