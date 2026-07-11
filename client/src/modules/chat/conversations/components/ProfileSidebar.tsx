import { useMemo, useState, type ChangeEvent } from "react"
import { Crown, Loader2, Shield, ShieldMinus, ShieldPlus, UserMinus } from "lucide-react"
import { profileInfoData } from "@shared/utils/dynamicData"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@shared/utils/axiosInstance"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import useChatList from "@chat/conversations/hooks/useChatList"
import useAuth from "@auth/hooks/useAuth"
import ChatInfoFiles from "./ChatInfoFiles"
import { groupManagementApi } from "../services/groupManagementApi"
import type { Dispatch, SetStateAction } from "react"
import type { Conversation, User } from "@shared/types"

interface ProfileSidebarData extends Partial<Conversation>, Partial<User> {
  groupOwner?: User | string
  participants?: Array<User | string>
  admins?: Array<User | string>
}

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
  data: ProfileSidebarData | null
  conversationId?: string
  setData?: Dispatch<SetStateAction<Conversation | null>>
}

const ProfileSidebar = ({ isOpen, onClose, data, conversationId, setData = () => {} }: ProfileSidebarProps) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { chatList, setChatList } = useChatList()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [groupName, setGroupName] = useState(data?.groupName || "")
  const [groupInfo, setGroupInfo] = useState(data?.groupInfo || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [pendingAction, setPendingAction] = useState<string | null>(null)

  const { mutate: handleSave, isLoading } = useMutation({
    mutationFn: async ({ groupName, groupInfo }: { groupName?: string; groupInfo?: string }) => {
      return await axiosInstance.patch(`${CONVERSATION_PATHS.EDIT_GROUP_INFO}/${data?._id}`, {
        groupName,
        groupInfo
      })
    },
    onMutate: async (newData: { groupName?: string; groupInfo?: string }) => {
      const previousChatList = chatList

      setData((prev: Conversation | null) =>
        prev
          ? {
              ...prev,
              ...(newData.groupName !== undefined && { groupName: newData.groupName }),
              ...(newData.groupInfo !== undefined && { groupInfo: newData.groupInfo })
            }
          : prev
      )

      if (newData.groupName !== undefined) {
        setChatList((prev) =>
          prev.map((chat) => (chat._id === data?._id ? { ...chat, groupName: newData.groupName } : chat))
        )
      }

      return { previousChatList }
    },
    onSuccess: () => {
      setIsEditingInfo(false)
      setIsEditing(false)
      console.log("Edited successfully!")
    },
    onError: (error: unknown) => {
      setIsEditing(false)
      setIsEditingInfo(false)
      console.error(error)
    }
  })

  const ownerId = getUserId(data?.groupOwner)
  const currentUserId = user?._id
  const adminIds = useMemo(() => new Set((data?.admins || []).map(getUserId).filter(Boolean)), [data?.admins])
  const currentUserIsOwner = Boolean(currentUserId && ownerId === currentUserId)
  const currentUserIsAdmin = Boolean(currentUserId && (currentUserIsOwner || adminIds.has(currentUserId)))

  const managementMutation = useMutation({
    mutationFn: async ({
      action,
      target
    }: {
      action: "remove" | "transfer" | "promote" | "demote"
      target: User
    }) => {
      if (!conversationId) throw new Error("Conversation id is missing.")
      setPendingAction(`${action}:${target._id}`)

      if (action === "remove") return groupManagementApi.removeParticipants(conversationId, [target._id])
      if (action === "transfer") return groupManagementApi.transferOwnership(conversationId, target._id)
      if (action === "promote") return groupManagementApi.promoteAdmin(conversationId, target._id)
      return groupManagementApi.demoteAdmin(conversationId, target._id)
    },
    onSuccess: (_result, { action, target }) => {
      setData((prev: Conversation | null) => {
        if (!prev) return prev

        if (action === "remove") {
          return {
            ...prev,
            participants: prev.participants.filter((participant) => getUserId(participant) !== target._id),
            admins: (prev.admins || []).filter((admin) => getUserId(admin) !== target._id)
          }
        }

        if (action === "transfer") {
          const previousOwner = prev.groupOwner
          const participantsWithoutNewOwner = prev.participants.filter((participant) => getUserId(participant) !== target._id)
          const nextParticipants =
            previousOwner && typeof previousOwner !== "string"
              ? [...participantsWithoutNewOwner, previousOwner]
              : participantsWithoutNewOwner

          return {
            ...prev,
            groupOwner: target,
            participants: nextParticipants,
            admins: [...(prev.admins || []).filter((admin) => getUserId(admin) !== currentUserId), target]
          }
        }

        if (action === "promote") {
          return {
            ...prev,
            admins: [...(prev.admins || []).filter((admin) => getUserId(admin) !== target._id), target]
          }
        }

        return {
          ...prev,
          admins: (prev.admins || []).filter((admin) => getUserId(admin) !== target._id)
        }
      })

      queryClient.invalidateQueries({ queryKey: ["groupConversation", conversationId] })
    },
    onError: (error) => {
      console.error("Group management action failed:", error)
    },
    onSettled: () => {
      setPendingAction(null)
    }
  })

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const ownerUser = data?.groupOwner && typeof data.groupOwner !== "string" ? data.groupOwner : null
  const memberRows = useMemo(
    () =>
      [
        ...(ownerUser ? [ownerUser] : []),
        ...(data?.participants || []).filter((member): member is User => typeof member !== "string")
      ].filter((member, index, rows) => rows.findIndex((row) => row._id === member._id) === index),
    [data?.participants, ownerUser]
  )
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return memberRows
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return memberRows.filter((member) =>
      `${member.username} ${member.displayName || ""}`.toLowerCase().includes(normalizedQuery)
    )
  }, [memberRows, searchQuery])
  const profilePictureUrl = "profilePicture" in (data ?? {}) ? data?.profilePicture?.url : undefined
  const aboutText = data?.conversationType ? data?.groupInfo : "bio" in (data ?? {}) ? data?.bio : ""

  return (
    <>
      {isOpen && (
        <div
          className="bg-opacity-40 fixed inset-0 z-40"
          onClick={() => {
            setIsEditing(false)
            setIsEditingInfo(false)
            onClose()
          }}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-96 transform overflow-y-auto bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{data?.conversationType ? "Group Info" : "Chat Info"}</h3>
          <button
            onClick={() => {
              setIsEditingInfo(false)
              setIsEditing(false)
              onClose()
            }}
            className="text-xl text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4 text-center">
          {data?.conversationType ? (
            <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-gray-300 text-xl font-semibold text-white">
              {data?.groupName?.charAt(0).toUpperCase()}
            </div>
          ) : profilePictureUrl ? (
            <img src={profilePictureUrl} alt="Profile" className="mx-auto h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-300 text-xl font-semibold text-white">
              {("username" in (data ?? {}) ? data?.username?.charAt(0).toUpperCase() : undefined) || "U"}
            </div>
          )}
          <div className="mt-4 flex items-center justify-center gap-2">
            {isEditing && data?.conversationType ? (
              <>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="border-b border-gray-400 text-center text-lg font-bold outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handleSave({ groupName })}
                  className="bg-custom-green flex size-7 items-center justify-center rounded-full text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <h4 className="text-lg font-bold">
                  {("username" in (data ?? {}) ? data?.username : undefined) || data?.groupName || "Unknown"}
                </h4>
                {data?.conversationType && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-custom-green flex size-7 items-center justify-center rounded-full text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
          <div className="mt-2 flex items-center justify-center gap-x-2 text-sm text-gray-600">
            {isEditingInfo ? (
              <>
                <input
                  type="text"
                  value={groupInfo}
                  onChange={(e) => setGroupInfo(e.target.value)}
                  className="border-b border-gray-400 text-center text-sm outline-none"
                  autoFocus
                />

                <button
                  onClick={() => handleSave({ groupInfo })}
                  className="bg-custom-green flex size-7 items-center justify-center rounded-full text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-4 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <p>{aboutText || (data?.conversationType ? "No group info available" : "No bio available")}</p>
                {data?.conversationType && (
                  <button
                    onClick={() => setIsEditingInfo(true)}
                    className="bg-custom-green flex size-7 items-center justify-center rounded-full text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 w-full px-6">
          <div className="flex justify-around">
            {profileInfoData.map((item, index) => (
              <div key={index} className="flex cursor-pointer flex-col items-center">
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-white shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="text-custom-text size-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <ChatInfoFiles conversationId={conversationId} />

        {data?.conversationType && (
          <div className="mt-6 max-h-[35%] overflow-y-auto border-t px-4 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-md font-semibold">Members ({memberRows.length})</h4>
              {currentUserIsAdmin && (
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Admin tools
                </span>
              )}
            </div>

            <div className="relative mx-auto mb-4 w-full">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m2.7-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"
                  />
                </svg>
              </span>
              <input
                value={searchQuery}
                onChange={handleSearchChange}
                type="text"
                placeholder="Search members"
                className="w-full rounded bg-slate-100 p-2 pl-12 placeholder:text-sm placeholder:text-slate-400 focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>

            {filteredMembers.length > 0 ? (
              <ul className="space-y-2">
                {filteredMembers.map((member) => (
                  <GroupMemberRow
                    key={member._id}
                    member={member}
                    isOwner={ownerId === member._id}
                    isAdmin={adminIds.has(member._id) || ownerId === member._id}
                    currentUserIsOwner={currentUserIsOwner}
                    currentUserIsAdmin={currentUserIsAdmin}
                    pendingAction={pendingAction}
                    onAction={(action) => managementMutation.mutate({ action, target: member })}
                  />
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">No members found</p>
            )}
          </div>
        )}
      </div>
    </>
  )
}

const getUserId = (value?: User | string | null) => (typeof value === "string" ? value : value?._id)

interface GroupMemberRowProps {
  member: User
  isOwner: boolean
  isAdmin: boolean
  currentUserIsOwner: boolean
  currentUserIsAdmin: boolean
  pendingAction: string | null
  onAction: (action: "remove" | "transfer" | "promote" | "demote") => void
}

const GroupMemberRow = ({
  member,
  isOwner,
  isAdmin,
  currentUserIsOwner,
  currentUserIsAdmin,
  pendingAction,
  onAction
}: GroupMemberRowProps) => {
  const canManage = !isOwner && (currentUserIsOwner || (currentUserIsAdmin && !isAdmin))
  const isBusy = Boolean(pendingAction?.endsWith(`:${member._id}`))
  const avatarUrl = member.profilePicture?.url || member.avatar || ""

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg p-2 transition hover:bg-slate-50">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            (member.displayName || member.username || "U").charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{member.displayName || member.username}</p>
          <p className="truncate text-xs text-slate-500">@{member.username}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {isOwner ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
            <Crown size={12} />
            Owner
          </span>
        ) : isAdmin ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700">
            <Shield size={12} />
            Admin
          </span>
        ) : null}

        {isBusy && <Loader2 size={16} className="animate-spin text-green-600" />}

        {!isBusy && canManage && (
          <>
            {currentUserIsOwner && (
              <button
                type="button"
                onClick={() => onAction("transfer")}
                className="grid size-8 place-items-center rounded-full text-amber-700 transition hover:bg-amber-50 focus:ring-2 focus:ring-amber-300 focus:outline-none"
                title="Transfer ownership"
                aria-label={`Transfer ownership to ${member.username}`}
              >
                <Crown size={16} />
              </button>
            )}
            {currentUserIsOwner && (
              <button
                type="button"
                onClick={() => onAction(isAdmin ? "demote" : "promote")}
                className="grid size-8 place-items-center rounded-full text-green-700 transition hover:bg-green-50 focus:ring-2 focus:ring-green-300 focus:outline-none"
                title={isAdmin ? "Remove admin" : "Make admin"}
                aria-label={isAdmin ? `Remove ${member.username} as admin` : `Make ${member.username} an admin`}
              >
                {isAdmin ? <ShieldMinus size={16} /> : <ShieldPlus size={16} />}
              </button>
            )}
            <button
              type="button"
              onClick={() => onAction("remove")}
              className="grid size-8 place-items-center rounded-full text-red-600 transition hover:bg-red-50 focus:ring-2 focus:ring-red-200 focus:outline-none"
              title="Remove member"
              aria-label={`Remove ${member.username}`}
            >
              <UserMinus size={16} />
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default ProfileSidebar
