import React, { useState } from "react"

const DarkModeSwitch = () => {
  const [isDark, setIsDark] = useState(false)

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev)
  }

  return (
    <div className="inline-flex items-center space-x-2">
      <h1>Dark Mode: </h1>
      <div
        className={`relative flex h-10 w-[4.5rem] cursor-pointer items-center rounded-full border-2 border-gray-300 transition-colors duration-300 ${
          isDark ? "bg-black/85" : "bg-custom-white"
        }`}
        onClick={toggleDarkMode}
      >
        <div
          className={`absolute left-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-custom-green transition-all duration-300 ${
            isDark ? "translate-x-8 text-white" : "translate-x-0"
          }`}
        >
          {isDark ? (
            <svg className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 0111.46 3.647a9.004 9.004 0 00.296 14.157 9.004 9.004 0 008.598-2.45z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

export default DarkModeSwitch
