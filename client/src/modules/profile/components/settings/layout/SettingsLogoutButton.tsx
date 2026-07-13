import { Loader2, LogOut } from "lucide-react"

interface SettingsLogoutButtonProps {
  isLoggingOut: boolean
  onLogout: () => void
}

const SettingsLogoutButton = ({ isLoggingOut, onLogout }: SettingsLogoutButtonProps) => {
  return (
    <div className="border-t border-gray-100 pt-3">
      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="inline-flex items-center gap-2">
          {isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </span>
      </button>
    </div>
  )
}

export default SettingsLogoutButton
