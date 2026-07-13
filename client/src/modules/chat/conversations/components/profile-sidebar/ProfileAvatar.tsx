import type { ProfileSidebarData } from "@chat/conversations/types/profileSidebar"

const ProfileAvatar = ({
  data,
  profilePictureUrl
}: {
  data: ProfileSidebarData | null
  profilePictureUrl?: string
}) => {
  if (data?.conversationType) {
    return (
      <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-gray-300 text-xl font-semibold text-white">
        {data?.groupName?.charAt(0).toUpperCase()}
      </div>
    )
  }

  if (profilePictureUrl) {
    return <img src={profilePictureUrl} alt="Profile" className="mx-auto h-24 w-24 rounded-full object-cover" />
  }

  return (
    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-300 text-xl font-semibold text-white">
      {("username" in (data ?? {}) ? data?.username?.charAt(0).toUpperCase() : undefined) || "U"}
    </div>
  )
}

export default ProfileAvatar
