import type { GroupManagementAction } from "@chat/conversations/types/profileSidebar"

export interface ProfileSidebarState {
  isEditing: boolean
  isEditingInfo: boolean
  groupName: string
  groupInfo: string
  searchQuery: string
  pendingAction: string | null
}

export type ProfileSidebarAction =
  | { type: "SYNC_GROUP_FIELDS"; payload: { groupName: string; groupInfo: string } }
  | { type: "SET_GROUP_NAME"; payload: string }
  | { type: "SET_GROUP_INFO"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_EDITING"; payload: boolean }
  | { type: "SET_EDITING_INFO"; payload: boolean }
  | { type: "CLOSE_EDITOR" }
  | { type: "SET_PENDING_ACTION"; payload: { action: GroupManagementAction; targetId: string } | null }

export const createProfileSidebarInitialState = ({
  groupName = "",
  groupInfo = ""
}: {
  groupName?: string
  groupInfo?: string
} = {}): ProfileSidebarState => ({
  isEditing: false,
  isEditingInfo: false,
  groupName,
  groupInfo,
  searchQuery: "",
  pendingAction: null
})

export const profileSidebarReducer = (
  state: ProfileSidebarState,
  action: ProfileSidebarAction
): ProfileSidebarState => {
  switch (action.type) {
    case "SYNC_GROUP_FIELDS":
      return {
        ...state,
        groupName: action.payload.groupName,
        groupInfo: action.payload.groupInfo
      }
    case "SET_GROUP_NAME":
      return { ...state, groupName: action.payload }
    case "SET_GROUP_INFO":
      return { ...state, groupInfo: action.payload }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "SET_EDITING":
      return { ...state, isEditing: action.payload }
    case "SET_EDITING_INFO":
      return { ...state, isEditingInfo: action.payload }
    case "CLOSE_EDITOR":
      return { ...state, isEditing: false, isEditingInfo: false }
    case "SET_PENDING_ACTION":
      return {
        ...state,
        pendingAction: action.payload ? `${action.payload.action}:${action.payload.targetId}` : null
      }
    default:
      return state
  }
}
