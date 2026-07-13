import type { Conversation, User } from "@shared/types"
import type { GroupManagementAction, ProfileSidebarData } from "@chat/conversations/types/profileSidebar"

export const getUserId = (value?: User | string | null) => (typeof value === "string" ? value : value?._id)

export const getAdminIds = (admins?: Array<User | string>) =>
  new Set((admins || []).flatMap((admin) => (getUserId(admin) ? [getUserId(admin) as string] : [])))

export const getProfilePictureUrl = (data: ProfileSidebarData | null) =>
  data && "profilePicture" in data ? data.profilePicture?.url : undefined

export const getAboutText = (data: ProfileSidebarData | null) =>
  data?.conversationType ? data.groupInfo : data && "bio" in data ? data.bio : ""

export const getOwnerUser = (data: ProfileSidebarData | null) =>
  data?.groupOwner && typeof data.groupOwner !== "string" ? data.groupOwner : null

export const buildMemberRows = (data: ProfileSidebarData | null) => {
  const seenIds = new Set<string>()
  const rows: User[] = []
  const addMember = (member?: User | string | null) => {
    if (!member || typeof member === "string" || seenIds.has(member._id)) return
    seenIds.add(member._id)
    rows.push(member)
  }

  addMember(getOwnerUser(data))
  data?.participants?.forEach(addMember)
  return rows
}

export const filterMembers = (members: User[], searchQuery: string) => {
  if (!searchQuery.trim()) return members
  const normalizedQuery = searchQuery.trim().toLowerCase()
  return members.filter((member) =>
    `${member.username} ${member.displayName || ""}`.toLowerCase().includes(normalizedQuery)
  )
}

export const applyGroupManagementAction = ({
  conversation,
  action,
  target,
  currentUserId
}: {
  conversation: Conversation
  action: GroupManagementAction
  target: User
  currentUserId?: string
}): Conversation => {
  if (action === "remove") {
    return {
      ...conversation,
      participants: conversation.participants.filter((participant) => getUserId(participant) !== target._id),
      admins: (conversation.admins || []).filter((admin) => getUserId(admin) !== target._id)
    }
  }

  if (action === "transfer") {
    const previousOwner = conversation.groupOwner
    const participantsWithoutNewOwner = conversation.participants.filter((participant) => getUserId(participant) !== target._id)
    const nextParticipants =
      previousOwner && typeof previousOwner !== "string"
        ? [...participantsWithoutNewOwner, previousOwner]
        : participantsWithoutNewOwner

    return {
      ...conversation,
      groupOwner: target,
      participants: nextParticipants,
      admins: [...(conversation.admins || []).filter((admin) => getUserId(admin) !== currentUserId), target]
    }
  }

  if (action === "promote") {
    return {
      ...conversation,
      admins: [...(conversation.admins || []).filter((admin) => getUserId(admin) !== target._id), target]
    }
  }

  return {
    ...conversation,
    admins: (conversation.admins || []).filter((admin) => getUserId(admin) !== target._id)
  }
}
