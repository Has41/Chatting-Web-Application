import React, { useState } from "react"
import { profileInfo } from "../../../utils/dynamicData"

const ProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="relative font-poppins">
      <div
        className="size-10 bg-slate-300 cursor-pointer rounded-full flex items-center justify-center"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <img className="w-full h-full rounded-full object-cover" src="https://via.placeholder.com/40" alt="User Profile" />
      </div>

      {isDropdownOpen && (
        <div className="absolute left-1 bottom-12 w-40 bg-white rounded-md shadow-xl ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {profileInfo.map((option) => (
              <button
                key={option}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
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
