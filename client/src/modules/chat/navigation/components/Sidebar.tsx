import { navOptions } from "@shared/utils/dynamicData"
import ChatLogo from "@shared/components/ChatLogo"
import useAuth from "@auth/hooks/useAuth"

interface SidebarProps {
  setSelectedMenu: (menu: string) => void
}

const Sidebar = ({ setSelectedMenu }: SidebarProps) => {
  const { user } = useAuth()
  const profilePictureUrl = user?.profilePicture?.url

  return (
    <nav className="font-poppins flex h-screen w-[6%] flex-col items-center justify-between bg-white transition-all duration-500">
      <div className="mt-5 flex justify-center">
        <ChatLogo />
      </div>

      <ul className="flex flex-col justify-start gap-y-10">
        {navOptions.map((option, index) => (
          <li className="cursor-pointer" onClick={() => setSelectedMenu(option.menu)} key={index}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-gray-700"
              aria-label={option.name}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={option.path} />
            </svg>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-y-6 pb-6">
        <button
          type="button"
          onClick={() => setSelectedMenu("settings")}
          className="flex size-12 items-center justify-center rounded-full p-1 transition hover:bg-slate-100 focus:ring-2 focus:ring-custom-green focus:outline-none"
          title="Profile and settings"
          aria-label="Profile and settings"
        >
          {profilePictureUrl ? (
            <img src={profilePictureUrl} alt="" className="size-10 rounded-full object-cover shadow-sm" />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full bg-slate-300 text-sm font-semibold text-white shadow-sm">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}

export default Sidebar
