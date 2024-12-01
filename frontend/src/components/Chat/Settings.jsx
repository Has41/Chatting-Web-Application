import React from "react"
import StatusDropdown from "./ChatUtils/StatusDropdown"

const Settings = () => {
  return (
    <aside
      className="w-1/4 h-screen bg-gray-50 border-l border-l-slate-200 border-r border-r-slate-200 font-poppins"
      aria-label="Settings"
    >
      <section className="p-4">
        <h2 className="text-xl text-black/80 font-semibold mb-4">Settings</h2>
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-white shadow"
            />
            <button
              className="absolute bottom-1 right-1 bg-gray-100 border border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-200"
              aria-label="Change Profile Picture"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-2">Username</h3>
          <div className="flex items-center justify-center gap-x-1">
            <StatusDropdown />
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          {/* Personal Info */}
          <details>
            <summary className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded-md">
              <span className="text-sm font-medium">Personal Info</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 group-open:rotate-180 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12l-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>
            <div className="mt-2 pl-4 text-sm text-gray-600">Update your personal details here.</div>
          </details>

          {/* Themes */}
          <details>
            <summary className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded-md">
              <span className="text-sm font-medium">Themes</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 group-open:rotate-180 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12l-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>
            <div className="mt-2 pl-4 text-sm text-gray-600">Customize your theme preferences.</div>
          </details>

          {/* Privacy */}
          <details>
            <summary className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded-md">
              <span className="text-sm font-medium">Privacy</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 group-open:rotate-180 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12l-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>
            <div className="mt-2 pl-4 text-sm text-gray-600">Manage your privacy settings.</div>
          </details>

          {/* Security */}
          <details>
            <summary className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded-md">
              <span className="text-sm font-medium">Security</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 group-open:rotate-180 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12l-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>
            <div className="mt-2 pl-4 text-sm text-gray-600">Configure your account security.</div>
          </details>

          {/* Help */}
          <details>
            <summary className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded-md">
              <span className="text-sm font-medium">Help</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 group-open:rotate-180 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12l-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>
            <div className="mt-2 pl-4 text-sm text-gray-600">Find FAQs and support resources.</div>
          </details>
        </div>
      </section>
    </aside>
  )
}

export default Settings
