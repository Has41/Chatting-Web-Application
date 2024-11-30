import React, { useState } from "react"
import { navOptions } from "../../utils/DynamicData"

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <nav
      className={`h-screen font-poppins flex flex-col items-center justify-between bg-white ${
        isHovered ? "w-[12%]" : "w-[6%]"
      } transition-all duration-500`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="flex justify-center py-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-9 text-black"
          aria-label="Logo"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
          />
        </svg>
        {isHovered && <h1 className="ml-1 mt-1 text-lg font-semibold">ChitChat</h1>}
      </div>

      {/* Options */}
      <ul className="flex flex-col justify-start gap-y-5">
        {navOptions.map((option, index) => (
          <li
            key={index}
            className="flex items-center px-5 py-2 cursor-pointer hover:bg-slate-100 transition-all duration-500 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
              aria-label={option.name}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={option.path} />
            </svg>
            {isHovered && <span className="ml-3 text-sm text-gray-600">{option.name}</span>}
          </li>
        ))}
      </ul>

      {/* Profile and Settings */}
      <div className="flex flex-col items-center gap-y-6 pb-6">
        <div className="flex items-center px-5 py-2 cursor-pointer hover:bg-slate-100 transition-all duration-500 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-700 hover:text-black"
            aria-label="Settings"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          {isHovered && <span className="ml-1 text-sm text-gray-600">Settings</span>}
        </div>
        <div className="flex items-center">
          <div className="size-10 bg-slate-300 cursor-pointer rounded-full">
            {/* <img className="" src="" alt="User Profile" /> */}
          </div>
          {isHovered && <div className="ml-2 text-sm text-gray-600">Profile</div>}
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
