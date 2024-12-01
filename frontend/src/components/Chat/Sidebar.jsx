import React from "react"
import { NavLink } from "react-router-dom"
import { navOptions } from "../../utils/dynamicData"
import ProfileDropdown from "./ChatUtils/ProfileDropdown"

const Sidebar = () => {
  return (
    <nav className="h-screen font-poppins w-[6%] flex flex-col items-center justify-between bg-white transition-all duration-500">
      {/* Logo */}
      <div className="flex justify-center mt-5">
        <svg
          fill="#96E6A1"
          className="size-11"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 60 60"
          xml:space="preserve"
        >
          <path
            d="M59.949,58.684L55.104,44.15C57.654,39.702,59,34.647,59,29.5C59,13.233,45.767,0,29.5,0S0,13.233,0,29.5S13.233,59,29.5,59
	c4.64,0,9.257-1.108,13.378-3.208l15.867,4.176C58.83,59.989,58.915,60,59,60c0.272,0,0.538-0.112,0.729-0.316
	C59.98,59.416,60.065,59.032,59.949,58.684z M16,21.015h14c0.552,0,1,0.448,1,1s-0.448,1-1,1H16c-0.552,0-1-0.448-1-1
	S15.448,21.015,16,21.015z M43,39.015H16c-0.552,0-1-0.448-1-1s0.448-1,1-1h27c0.552,0,1,0.448,1,1S43.552,39.015,43,39.015z
	 M43,31.015H16c-0.552,0-1-0.448-1-1s0.448-1,1-1h27c0.552,0,1,0.448,1,1S43.552,31.015,43,31.015z"
          />
        </svg>
      </div>

      {/* Options */}
      <ul className="flex flex-col justify-start gap-y-5">
        {navOptions.map((option, index) => (
          <li key={index}>
            <NavLink
              to={option.link}
              className="flex items-center p-3 cursor-pointer hover:bg-slate-100 transition-all duration-500 rounded-lg"
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
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Profile and Settings */}
      <div className="flex flex-col items-center gap-y-6 pb-6">
        <div className="flex items-center p-3 cursor-pointer hover:bg-slate-200 transition-all duration-500 rounded-md">
          <NavLink to={"/chat/settings"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
              aria-label="Settings"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </NavLink>
        </div>
        <div className="flex items-center">
          {/* <div className="size-10 bg-slate-300 cursor-pointer rounded-full">
            <img className="" src="" alt="User Profile" />
          </div> */}
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
