import type { Channel, User } from "@shared/types"

export type MemberAction = "remove" | "transfer" | "promote" | "demote"

export interface ChannelDraft {
  channelId: string
  name: string
  description: string
  visibility: Channel["visibility"]
  sendPermissions: NonNullable<Channel["sendPermissions"]>
}

export interface UserSearchResult extends User {
  isFriend?: boolean
}
