import React, { useState } from "react"

const StatusDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [status, setStatus] = useState("Active") // Default status

  const statuses = [
    { label: "Active", color: "text-green-600" },
    { label: "Away", color: "text-yellow-600" },
    { label: "Do Not Disturb", color: "text-red-600" },
    { label: "Offline", color: "text-gray-600" }
  ]

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus.label)
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      {/* Current Status */}
      <div
        className="flex items-center justify-center gap-x-1 cursor-pointer"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <p className={`text-sm ${statuses.find((s) => s.label === status)?.color}`}>{status}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute left-0 w-40 select-none rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {statuses.map((s) => (
              <button
                key={s.label}
                onClick={() => handleStatusChange(s)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${s.color} ${
                  status === s.label ? "font-semibold" : ""
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StatusDropdown
