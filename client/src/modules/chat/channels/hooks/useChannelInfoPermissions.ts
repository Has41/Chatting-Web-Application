import { useMemo } from "react"
import { Hash, Lock } from "lucide-react"
import type { Channel, User } from "@shared/types"
import { getUserId } from "../utils/channelInfo"

export const useChannelInfoPermissions = (channel: Channel, currentUserId?: string) => {
  const ownerId = getUserId(channel.owner)
  const adminIds = useMemo(
    () => new Set(channel.admins.flatMap((admin) => (getUserId(admin) ? [getUserId(admin) as string] : []))),
    [channel.admins]
  )
  const members = useMemo(
    () =>
      channel.members
        .filter((member): member is User => typeof member !== "string")
        .sort((first, second) => Number(getUserId(second) === ownerId) - Number(getUserId(first) === ownerId)),
    [channel.members, ownerId]
  )

  return {
    ownerId,
    adminIds,
    currentUserIsOwner: Boolean(currentUserId && currentUserId === ownerId),
    currentUserIsAdmin: Boolean(currentUserId && (currentUserId === ownerId || adminIds.has(currentUserId))),
    currentUserIsMember: Boolean(currentUserId && channel.members.some((member) => getUserId(member) === currentUserId)),
    members,
    VisibilityIcon: channel.visibility === "private" ? Lock : Hash
  }
}
