import type { Conversation } from "@shared/types"

export const mergeGroupConversationData = ({
  serverGroupData,
  groupOverride
}: {
  serverGroupData: Conversation | null
  groupOverride: Conversation | null
}) =>
  groupOverride && serverGroupData && groupOverride._id === serverGroupData._id
    ? { ...serverGroupData, ...groupOverride }
    : serverGroupData

export const getGroupInitial = (groupName?: string) => groupName?.charAt(0).toUpperCase() || "G"
