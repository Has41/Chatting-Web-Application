import type { User } from "@shared/types"

interface GroupData {
  participants?: (User | string)[]
  groupOwner?: string | User
}

const getGroupRecipients = (userData: GroupData | null, currentUserId: string): User[] => {
  if (!userData || !userData.participants || userData.participants.length === 0) return []

  const { participants = [], groupOwner } = userData
  const allMembers = [...participants, groupOwner]
  const seenUserIds = new Set<string>()

  return allMembers.reduce<User[]>((recipients, member) => {
    if (!member || typeof member === "string" || member._id === currentUserId || seenUserIds.has(member._id)) {
      return recipients
    }

    seenUserIds.add(member._id)
    recipients.push(member)
    return recipients
  }, [])
}
export default getGroupRecipients
