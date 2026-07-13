import type { Conversation, User } from "@shared/types"

export interface ProfileSidebarData extends Partial<Conversation>, Partial<User> {
  groupOwner?: User | string
  participants?: Array<User | string>
  admins?: Array<User | string>
}

export type GroupManagementAction = "remove" | "transfer" | "promote" | "demote"

export type GroupManagementVariables = {
  action: GroupManagementAction
  target: User
}

export type EditGroupInfoPayload = {
  conversationId: string
  groupName?: string
  groupInfo?: string
}
