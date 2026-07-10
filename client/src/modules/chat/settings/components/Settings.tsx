import { useState } from "react"
import StatusDropdown from "@shared/components/StatusDropdown"
import InfoDetails from "./Settings/InfoDetails"
import useAuth from "@auth/hooks/useAuth"
import ThemeSettings from "./Settings/ThemeSettings"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@shared/utils/axiosInstance"
import { AUTH_PATHS } from "@shared/constants/apiPaths"
import { useNavigate } from "react-router-dom"
import { Loader2, LogOut } from "lucide-react"

const Settings = () => {
  const { user, setUser, setIsAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [openSection, setOpenSection] = useState<string | null>("")
  const profilePictureUrl = user?.profilePicture?.url

  const toggleSection = (section: string) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section))
  }

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.post(AUTH_PATHS.LOG_OUT)
    },
    onSuccess: () => {
      setUser(null)
      setIsAuthenticated(false)
      navigate("/auth", { replace: true })
    },
    onError: (error: unknown) => {
      console.error("Error logging out:", error)
    }
  })

  return (
    <aside
      className="font-poppins h-screen w-1/4 border-r border-l border-r-slate-200 border-l-slate-200 bg-gray-50 select-none"
      aria-label="Settings"
    >
      <section>
        <h2 className="mb-4 p-3 text-xl font-semibold text-black/80">Settings</h2>
        <div className="mb-8 flex flex-col items-center">
          <div className="relative">
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt="Profile" className="h-20 w-20 rounded-full border-2 border-white shadow" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-xl font-semibold text-white shadow">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <button
              className="absolute right-1 bottom-1 rounded-full border border-gray-300 bg-gray-100 p-1 shadow-sm hover:bg-gray-200"
              aria-label="Change Profile Picture"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-800">{user?.username}</h3>
          <div className="flex items-center justify-center gap-x-1">
            <StatusDropdown />
          </div>
        </div>

        {/* Accordion Settings List */}
        <div className="max-h-[calc(100vh-200px)] w-full space-y-4 overflow-y-auto bg-white p-3 shadow-sm">
          {/* Personal Info */}
          <div>
            <button
              onClick={() => toggleSection("personal")}
              className="flex w-full cursor-pointer items-center justify-between p-2"
            >
              <span className="text-sm font-medium">Personal Info</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`h-5 w-5 transition-transform ${openSection === "personal" ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openSection === "personal" && (
              <div className="pl-2 text-sm text-gray-600">
                <InfoDetails />
              </div>
            )}
          </div>

          {/* Themes */}
          <div>
            <button
              onClick={() => toggleSection("themes")}
              className="flex w-full cursor-pointer items-center justify-between p-2"
            >
              <span className="text-sm font-medium">Themes</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`h-5 w-5 transition-transform ${openSection === "themes" ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openSection === "themes" && (
              <div className="mt-2 pl-2 text-sm text-gray-600">
                <ThemeSettings />
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection("privacy")}
              className="flex w-full cursor-pointer items-center justify-between p-2"
            >
              <span className="text-sm font-medium">Privacy</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`h-5 w-5 transition-transform ${openSection === "privacy" ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openSection === "privacy" && (
              <div className="mt-2 pl-4 text-sm text-gray-600">Manage your privacy settings.</div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection("security")}
              className="flex w-full cursor-pointer items-center justify-between p-2"
            >
              <span className="text-sm font-medium">Security</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`h-5 w-5 transition-transform ${openSection === "security" ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openSection === "security" && (
              <div className="mt-2 pl-4 text-sm text-gray-600">Configure your account security.</div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection("help")}
              className="flex w-full cursor-pointer items-center justify-between p-2"
            >
              <span className="text-sm font-medium">Help</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`h-5 w-5 transition-transform ${openSection === "help" ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openSection === "help" && (
              <div className="mt-2 pl-4 text-sm text-gray-600">Find FAQs and support resources.</div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="inline-flex items-center gap-2">
                {isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </section>
    </aside>
  )
}

export default Settings
