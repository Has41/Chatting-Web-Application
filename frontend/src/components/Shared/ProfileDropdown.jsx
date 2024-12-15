import React, { useState } from "react"
import { profileInfo } from "../../utils/dynamicData"

const ProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="relative font-poppins">
      <div
        className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-slate-300"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <img className="h-full w-full rounded-full object-cover" src="https://via.placeholder.com/40" alt="User Profile" />
      </div>

      {isDropdownOpen && (
        <div className="absolute bottom-12 left-1 z-10 w-40 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {profileInfo.map((option) => (
              <button
                key={option}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                <div className="flex gap-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={option.iconPath} />
                  </svg>
                  <p>{option.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
