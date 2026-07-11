import { useState } from "react"
import { profileInfo } from "@shared/utils/dynamicData"
import useAuth from "@auth/hooks/useAuth"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@shared/api/api-client"
import { AUTH_PATHS } from "@shared/constants/apiPaths"
import { useNavigate } from "react-router-dom"

const ProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, setUser, setIsAuthenticated } = useAuth()
  const navigate = useNavigate()
  const profilePictureUrl = user?.profilePicture?.url

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
    onError: (err: unknown) => {
      console.error(err)
    }
  })

  const handleOptionClick = (option: { name: string }) => {
    if (option.name === "Logout") {
      mutate()
    } else {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  return (
    <div className="font-poppins relative">
      <div
        className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-slate-300"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        {profilePictureUrl ? (
          <img className="h-full w-full rounded-full object-cover" src={profilePictureUrl} alt="User Profile" />
        ) : (
          <span className="text-sm font-semibold text-white">{user?.username?.charAt(0).toUpperCase() || "U"}</span>
        )}
      </div>

      {isDropdownOpen && (
        <div className="ring-opacity-5 absolute bottom-12 left-1 z-10 w-40 rounded-md bg-white shadow-xl ring-1 ring-black">
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
