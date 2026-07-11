import { useState } from "react"

const STATUSES = [
  { label: "Active", color: "text-green-600" },
  { label: "Away", color: "text-yellow-600" },
  { label: "Do Not Disturb", color: "text-red-600" },
  { label: "Offline", color: "text-gray-600" }
] as const

type StatusOption = (typeof STATUSES)[number]

const StatusDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [status, setStatus] = useState("Active") // Default status

  const handleStatusChange = (newStatus: StatusOption) => {
    setStatus(newStatus.label)
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      {/* Current Status */}
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center gap-x-1"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        aria-expanded={isDropdownOpen}
        aria-label="Change status"
      >
        <span className={`text-sm ${STATUSES.find((s) => s.label === status)?.color}`}>{status}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="ring-opacity-5 absolute left-0 w-40 rounded-md bg-white shadow-lg ring-1 ring-black select-none">
          <div className="py-1">
            {STATUSES.map((s) => (
              <button
                type="button"
                key={s.label}
                onClick={() => handleStatusChange(s)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${s.color} ${
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
