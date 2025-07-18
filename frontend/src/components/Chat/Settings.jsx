import { useState } from "react"
import StatusDropdown from "../Shared/StatusDropdown"
import InfoDetails from "./Settings/InfoDetails"
import useAuth from "../../hooks/useAuth"
import ThemeSettings from "./Settings/ThemeSettings"

const Settings = () => {
  const { user } = useAuth()
  const [openSection, setOpenSection] = useState("")

  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section))
  }

  return (
    <aside
      className="h-screen w-1/4 select-none border-l border-r border-l-slate-200 border-r-slate-200 bg-gray-50 font-poppins"
      aria-label="Settings"
    >
      <section>
        <h2 className="mb-4 p-3 text-xl font-semibold text-black/80">Settings</h2>
        <div className="mb-8 flex flex-col items-center">
          <div className="relative">
            <img
              src={user?.profilePicture.url}
              alt="Profile"
              className="h-20 w-20 rounded-full border-2 border-white shadow"
            />
            <button
              className="absolute bottom-1 right-1 rounded-full border border-gray-300 bg-gray-100 p-1 shadow-sm hover:bg-gray-200"
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
        </div>
      </section>
    </aside>
  )
}

export default Settings
