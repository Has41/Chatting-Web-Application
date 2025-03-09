import React, { useState } from "react"
import { profileInfo } from "../../utils/dynamicData"
import useAuth from "../../hooks/useAuth"
import { useMutation } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import { AUTH_PATHS } from "../../constants/apiPaths"
import { useNavigate } from "react-router-dom"

const ProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, setUser, setIsAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.post(AUTH_PATHS.LOG_OUT)
    },
    onSuccess: () => {
      console.log("Logged out successfully.")
      setUser(null)
      setIsAuthenticated(false)
      navigate("/")
    },
    onError: (err) => {
      console.error(err)
    }
  })

  const handleOptionClick = (option) => {
    if (option.name === "Logout") {
      mutate()
    } else {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  return (
    <div className="relative font-poppins">
      <div
        className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-slate-300"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <img className="h-full w-full rounded-full object-cover" src={user?.profilePicture.url} alt="User Profile" />
      </div>

      {isDropdownOpen && (
        <div className="absolute bottom-12 left-1 z-10 w-40 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {profileInfo.map((option) => (
              <button
                key={option.name}
                onClick={() => handleOptionClick(option)}
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
