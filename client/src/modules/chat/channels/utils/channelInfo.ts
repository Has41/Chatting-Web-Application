import type { ConfirmActionProps } from "@shared/components/callables/ConfirmAction"
import type { Channel, User } from "@shared/types"
import type { ChannelDraft, MemberAction, UserSearchResult } from "../types/channelInfo"

export const EMPTY_SEARCH_RESULTS: UserSearchResult[] = []

export const getUserId = (value?: User | string | null) => (typeof value === "string" ? value : value?._id)

export const getUserLabel = (user: User) => user.displayName || user.username || "Member"

export const getChannelDraft = (channel: Channel): ChannelDraft => ({
  channelId: channel._id,
  name: channel.name,
  description: channel.description || "",
  visibility: channel.visibility,
  sendPermissions: channel.sendPermissions || "admins"
})

export const getMemberConfirmation = (memberAction: MemberAction, target: User, channelName: string): ConfirmActionProps => {
  if (memberAction === "promote" || memberAction === "demote") {
    return {
      title: memberAction === "promote" ? "Make admin?" : "Remove admin?",
      description:
        memberAction === "promote"
          ? `${getUserLabel(target)} will be able to manage ${channelName}.`
          : `${getUserLabel(target)} will lose admin tools for ${channelName}.`,
      confirmLabel: memberAction === "promote" ? "Make admin" : "Remove admin",
      tone: "warning"
    }
  }

  if (memberAction === "remove") {
    return {
      title: "Remove member?",
      description: `${getUserLabel(target)} will lose access to ${channelName} unless an admin adds them again.`,
      confirmLabel: "Remove",
      tone: "danger"
    }
  }

  return {
    title: "Transfer ownership?",
    description: `${getUserLabel(target)} will become the owner of ${channelName}. You will remain a member unless they remove you later.`,
    confirmLabel: "Transfer",
    tone: "warning"
  }
}
