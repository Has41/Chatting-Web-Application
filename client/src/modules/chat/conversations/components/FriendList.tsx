import { useEffect, useState } from "react"
import UserSearch from "./Messages/UserSearch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@shared/utils/axiosInstance"
import { USER_PATHS } from "@shared/constants/apiPaths"
import { getChatConversationRoute, getNewChatRoute } from "@shared/constants/routePaths"
import { Link } from "react-router-dom"
import { Bell, Check, MessageCircle, UserRound, X } from "lucide-react"
import type { User } from "@shared/types"

interface FriendRequest {
  from: User
}

interface FriendConversation {
  _id: string
  participants?: User[]
  conversationType?: "private" | "group"
}

const FriendList = () => {
  const queryClient = useQueryClient()
  const [openNotifcation, setOpenNotification] = useState(false)
  const [friendList, setFriendList] = useState<User[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  const toggleNotification = () => setOpenNotification((prev) => !prev)

  const { data: friendsData, error: friendsError } = useQuery({
    queryKey: ["friendList&Requests"],
    queryFn: async () => {
      const response = await axiosInstance.get(USER_PATHS.GET_FRIENDS_AND_REQUESTS)
      return response.data as { friends: User[]; friendRequests: FriendRequest[] }
    }
  })

  const { data: friendConversationData } = useQuery({
    queryKey: ["friendConversations"],
    queryFn: async () => {
      const response = await axiosInstance.get(USER_PATHS.GET_FRIENDS_AND_CONVERSATIONS)
      return response.data as { friends: User[]; conversations: FriendConversation[] }
    }
  })

  useEffect(() => {
    if (!friendsData) return
    setFriendList(friendsData.friends || [])
    setFriendRequests(friendsData.friendRequests || [])
  }, [friendsData])

  useEffect(() => {
    if (!friendsError) return
    console.error("Error fetching friend list and requests:", friendsError)
  }, [friendsError])

  const getFriendChatRoute = (friendId: string) => {
    const existingConversation = friendConversationData?.conversations?.find((conversation) =>
      conversation.participants?.some((participant) => participant?._id === friendId)
    )

    return existingConversation ? getChatConversationRoute(existingConversation._id) : getNewChatRoute(friendId)
  }

  const { mutate: respondFriendRequest } = useMutation({
    mutationFn: async ({ userId, response }: { userId: string; response: "accepted" | "rejected" }) => {
      return await axiosInstance.post(`${USER_PATHS.RESPOND_FRIEND_REQUEST}/${userId}`, {
        response
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendList&Requests"] })
      queryClient.invalidateQueries({ queryKey: ["friendConversations"] })
      queryClient.invalidateQueries({ queryKey: ["userSearch"] })
    },
    onError: (error: unknown) => {
      console.error("Error responding to friend request:", error)
    }
  })

  return (
    <aside
      className="font-poppins h-screen w-1/4 border-r border-l border-r-slate-200 border-l-slate-200 bg-gray-50"
      aria-label="Friend List"
    >
      <section className="p-4">
        <div className="relative mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black/80">Friends</h2>
          <button
            type="button"
            onClick={toggleNotification}
            className="relative rounded-full p-1 text-gray-500 transition hover:bg-slate-100 hover:text-gray-700"
            aria-label="Friend requests"
          >
            <Bell className="size-6" />
            {friendRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[0.65rem] font-bold text-white">
                {friendRequests.length}
              </span>
            )}
          </button>
          {openNotifcation && (
            <div className="absolute top-full right-0 z-10 mt-2 w-72 rounded-md bg-white p-3 shadow-lg ring-1 ring-black/5">
              {friendRequests.length > 0 ? (
                <div>
                  <h1 className="mb-4 font-semibold text-black/80">Friend Requests</h1>
                  <ul className="space-y-3">
                    {friendRequests.map((req) => (
                      <li
                        key={req?.from._id}
                        className="flex items-center justify-between gap-3 rounded px-2 py-2 hover:bg-gray-100"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {req.from.profilePicture?.url ? (
                            <img
                              src={req.from.profilePicture.url}
                              alt={req.from.username}
                              className="size-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                              <UserRound className="size-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{req.from.displayName || req.from.username}</p>
                            <p className="truncate text-xs text-slate-500">@{req.from.username}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => respondFriendRequest({ userId: req.from._id, response: "accepted" })}
                            className="rounded-full bg-emerald-500 p-2 text-white hover:bg-emerald-600"
                            aria-label={`Accept request from ${req.from.username}`}
                          >
                            <Check className="size-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => respondFriendRequest({ userId: req.from._id, response: "rejected" })}
                            className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                            aria-label={`Reject request from ${req.from.username}`}
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 italic">No new friend requests</div>
              )}
            </div>
          )}
        </div>

        <UserSearch />
        <div className="mt-8 max-w-full">
          <div>
            <h1 className="mb-4 font-semibold text-black/80">All Friends</h1>
          </div>
          <div className="my-4 w-full">
            <ul className="space-y-4">
              {friendList.length > 0 ? (
                friendList.map((friend) => (
                  <Link
                    to={getFriendChatRoute(friend._id)}
                    key={friend._id}
                    className="flex cursor-pointer items-center rounded p-2 transition-all duration-300 hover:bg-gray-100"
                  >
                    {friend.profilePicture?.url ? (
                      <img
                        src={friend.profilePicture.url}
                        alt={friend.username}
                        className="mr-4 size-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <UserRound className="size-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-800">{friend.displayName || friend.username}</p>
                      <p className="truncate text-xs text-slate-500">@{friend.username}</p>
                    </div>
                    <MessageCircle className="ml-auto size-5 text-slate-400" />
                  </Link>
                ))
              ) : (
                <li className="rounded-md bg-slate-100 px-3 py-4 text-center text-sm text-gray-500">
                  No friends yet. Search users and send a request.
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </aside>
  )
}

export default FriendList
