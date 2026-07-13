import { useEffect, useMemo, useReducer, type ChangeEvent, type Dispatch, type SetStateAction } from "react"
import useAuth from "@auth/hooks/useAuth"
import useChatList from "@chat/conversations/hooks/useChatList"
import { useEditGroupInfoMutation, useGroupManagementMutation } from "@chat/conversations/queries/profileSidebarQueries"
import {
  applyGroupManagementAction,
  buildMemberRows,
  filterMembers,
  getAboutText,
  getAdminIds,
  getProfilePictureUrl,
  getUserId
} from "@chat/conversations/utils/profileSidebar"
import {
  createProfileSidebarInitialState,
  profileSidebarReducer
} from "@chat/conversations/state/profileSidebarState"
import type { Conversation, User } from "@shared/types"
import type {
  EditGroupInfoPayload,
  GroupManagementAction,
  GroupManagementVariables,
  ProfileSidebarData
} from "@chat/conversations/types/profileSidebar"

export const useProfileSidebar = ({
  data,
  conversationId,
  setData,
  onClose
}: {
  data: ProfileSidebarData | null
  conversationId?: string
  setData: Dispatch<SetStateAction<Conversation | null>>
  onClose: () => void
}) => {
  const { user } = useAuth()
  const { setChatList } = useChatList()
  const [state, dispatch] = useReducer(
    profileSidebarReducer,
    createProfileSidebarInitialState({
      groupName: data?.groupName || "",
      groupInfo: data?.groupInfo || ""
    })
  )

  useEffect(() => {
    dispatch({
      type: "SYNC_GROUP_FIELDS",
      payload: {
        groupName: data?.groupName || "",
        groupInfo: data?.groupInfo || ""
      }
    })
  }, [data?._id, data?.groupInfo, data?.groupName])

  const ownerId = getUserId(data?.groupOwner)
  const currentUserId = user?._id
  const adminIds = useMemo(() => getAdminIds(data?.admins), [data?.admins])
  const currentUserIsOwner = Boolean(currentUserId && ownerId === currentUserId)
  const currentUserIsAdmin = Boolean(currentUserId && (currentUserIsOwner || adminIds.has(currentUserId)))
  const memberRows = useMemo(() => buildMemberRows(data), [data])
  const filteredMembers = useMemo(() => filterMembers(memberRows, state.searchQuery), [memberRows, state.searchQuery])

  const editGroupInfoMutation = useEditGroupInfoMutation()
  const groupManagementMutation = useGroupManagementMutation()

  const closeSidebar = () => {
    dispatch({ type: "CLOSE_EDITOR" })
    onClose()
  }

  const saveGroupName = () => {
    if (!data?._id) return
    saveGroupInfoChanges({ conversationId: data._id, groupName: state.groupName })
  }

  const saveGroupInfo = () => {
    if (!data?._id) return
    saveGroupInfoChanges({ conversationId: data._id, groupInfo: state.groupInfo })
  }

  const runMemberAction = (action: GroupManagementAction, target: User) => {
    if (!conversationId) return
    dispatch({ type: "SET_PENDING_ACTION", payload: { action, targetId: target._id } })
    groupManagementMutation.mutate(
      { conversationId, action, target },
      {
        onSuccess: (_result: unknown, variables: GroupManagementVariables) => {
          setData((prev) =>
            prev
              ? applyGroupManagementAction({
                  conversation: prev,
                  action: variables.action,
                  target: variables.target,
                  currentUserId
                })
              : prev
          )

        },
        onError: (error: unknown) => {
          console.error("Group management action failed:", error)
        },
        onSettled: () => {
          dispatch({ type: "SET_PENDING_ACTION", payload: null })
        }
      }
    )
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: event.target.value })
  }

  const saveGroupInfoChanges = (payload: EditGroupInfoPayload) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            ...(payload.groupName !== undefined && { groupName: payload.groupName }),
            ...(payload.groupInfo !== undefined && { groupInfo: payload.groupInfo })
          }
        : prev
    )

    if (payload.groupName !== undefined) {
      setChatList((prev) =>
        prev.map((chat) => (chat._id === data?._id ? { ...chat, groupName: payload.groupName } : chat))
      )
    }

    editGroupInfoMutation.mutate(payload, {
      onSuccess: () => {
        dispatch({ type: "CLOSE_EDITOR" })
      },
      onError: (error: unknown) => {
        dispatch({ type: "CLOSE_EDITOR" })
        console.error(error)
      }
    })
  }

  return {
    state,
    derived: {
      title: data?.conversationType ? "Group Info" : "Chat Info",
      profilePictureUrl: getProfilePictureUrl(data),
      aboutText: getAboutText(data),
      ownerId,
      adminIds,
      memberRows,
      filteredMembers,
      currentUserIsOwner,
      currentUserIsAdmin
    },
    status: {
      isSavingGroupInfo: editGroupInfoMutation.isPending
    },
    handlers: {
      closeSidebar,
      setGroupName: (value: string) => dispatch({ type: "SET_GROUP_NAME", payload: value }),
      setGroupInfo: (value: string) => dispatch({ type: "SET_GROUP_INFO", payload: value }),
      setIsEditing: (value: boolean) => dispatch({ type: "SET_EDITING", payload: value }),
      setIsEditingInfo: (value: boolean) => dispatch({ type: "SET_EDITING_INFO", payload: value }),
      saveGroupName,
      saveGroupInfo,
      handleSearchChange,
      runMemberAction
    }
  }
}
