import { UserRound } from "lucide-react"
import type { User } from "@shared/types"

interface UserAvatarProps {
  user: User
  size?: "sm" | "md"
  className?: string
}

const avatarSizes = {
  sm: "size-9",
  md: "size-12"
}

const iconSizes = {
  sm: "size-4",
  md: "size-5"
}

const UserAvatar = ({ user, size = "md", className = "" }: UserAvatarProps) => {
  const imageUrl = user.profilePicture?.url
  const label = user.displayName || user.username

  if (imageUrl) {
    return <img src={imageUrl} alt={label} className={`${avatarSizes[size]} rounded-full object-cover ${className}`} />
  }

  return (
    <div
      className={`flex ${avatarSizes[size]} shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 ${className}`}
    >
      <UserRound className={iconSizes[size]} />
    </div>
  )
}

export default UserAvatar
