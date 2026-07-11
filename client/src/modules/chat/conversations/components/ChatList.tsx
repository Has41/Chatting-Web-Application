import { useState } from "react"
import { Link } from "react-router-dom"
import useAuth from "@auth/hooks/useAuth"
import dayjs from "dayjs"
import GroupModal from "./GroupModal"
import ChatSearch from "./Messages/ChatSearch"
import { getChatConversationRoute, getGroupConversationRoute } from "@shared/constants/routePaths"
import useChatList from "@chat/conversations/hooks/useChatList"
import useFriendPresence from "@chat/conversations/hooks/useFriendPresence"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@shared/api/api-client"
import { USER_PATHS } from "@shared/constants/apiPaths"
import type { User } from "@shared/types"
import useStories from "@stories/queries/storyQueries"
import StoryTray from "@stories/components/StoryTray"

const ChatList = () => {
  const { user } = useAuth()
  const { chatList } = useChatList()
  const [showDropdown, setShowDropdown] = useState(false)
  const [openGroupModal, setOpenGroupModal] = useState(false)

  const { data: friendConversationData } = useQuery({
    queryKey: ["friendConversations"],
    queryFn: async () => {
      const response = await axiosInstance.get(USER_PATHS.GET_FRIENDS_AND_CONVERSATIONS)
      return response.data as { friends: User[] }
    },
    enabled: !!user
  })

  const friends = friendConversationData?.friends ?? []
  const { onlineUserIds } = useFriendPresence(friends)
  const { data: stories = [] } = useStories(!!user)

  const toggleDropdown = () => setShowDropdown((prev) => !prev)

  return (
    <aside
      className="font-poppins h-screen w-1/4 border-r border-l border-r-slate-200 border-l-slate-200 bg-gray-50"
      aria-label="Chat List"
    >
      <section className="px-4 py-6">
        <div className="relative mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black/80">Chats</h2>
          <div className="relative">
            <button
              type="button"
              onClick={toggleDropdown}
              className="inline-flex size-8 items-center justify-center rounded-full text-black/80 transition hover:bg-slate-100 focus:ring-2 focus:ring-custom-green focus:outline-none"
              aria-label="Open chat list menu"
              aria-expanded={showDropdown}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false)
                    setOpenGroupModal(true)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Make Group
                </button>
              </div>
            )}
            {openGroupModal && <GroupModal onClose={() => setOpenGroupModal(false)} />}
          </div>
        </div>

        <ChatSearch />
        <StoryTray stories={stories} friends={friends} onlineUserIds={onlineUserIds} />

        <div className="max-w-full">
          <div>
            <h1 className="mb-4 font-semibold text-black/80">Recent</h1>
          </div>
          {/* Here fix from backend to exclude current User */}
          {chatList &&
            chatList.map((conversation) => {
              const isGroup = conversation.conversationType === "group"

              const otherUser = !isGroup ? (conversation.participants as any[]).find((p) => p?._id !== user?._id) : null

              const imageUrl = isGroup ? conversation.groupPicture?.url : otherUser?.profilePicture?.url

              const displayName = isGroup ? conversation.groupName : otherUser?.displayName || otherUser?.username
              const isOtherUserOnline = !!otherUser?._id && onlineUserIds.has(otherUser._id)

              return (
                <div key={conversation._id} className="my-4 w-full">
                  <ul className="space-y-4">
                    <li>
                      <Link
                        to={
                          conversation.conversationType === "private"
                            ? getChatConversationRoute(conversation._id)
                            : getGroupConversationRoute(conversation._id)
                        }
                        className="flex cursor-pointer items-center rounded p-2 transition-all duration-500 hover:bg-gray-100"
                      >
                        {imageUrl ? (
                          <div className="relative mr-3">
                            <img
                              className="h-12 w-12 rounded-full bg-slate-200 object-cover"
                              src={imageUrl}
                              alt={displayName}
                            />
                            {!isGroup && (
                              <span
                                className={`absolute right-0 bottom-0 size-3 rounded-full border-2 border-white ${
                                  isOtherUserOnline ? "bg-emerald-500" : "bg-gray-300"
                                }`}
                              ></span>
                            )}
                          </div>
                        ) : (
                          <div className="relative mr-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-white">
                              {displayName?.charAt(0).toUpperCase()}
                            </div>
                            {!isGroup && (
                              <span
                                className={`absolute right-0 bottom-0 size-3 rounded-full border-2 border-white ${
                                  isOtherUserOnline ? "bg-emerald-500" : "bg-gray-300"
                                }`}
                              ></span>
                            )}
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="max-w-36 truncate font-semibold text-gray-800" title={displayName}>
                            {displayName}
                          </div>

                          <div
                            className="max-w-36 truncate text-xs text-gray-600"
                            title={conversation?.lastMessage?.content}
                          >
                            {conversation?.lastMessage?.content ||
                              (conversation?.lastMessage?.media?.mediaUrl ? "It's an image" : "")}
                          </div>
                        </div>

                        {conversation?.lastMessage?.createdAt && (
                          <div className="mb-auto flex flex-col text-xs text-gray-500">
                            <p>{dayjs(conversation?.lastMessage?.createdAt).format("h:mm a")}</p>
                          </div>
                        )}
                      </Link>
                    </li>
                  </ul>
                </div>
              )
            })}
        </div>
        {chatList.length === 0 && (
          <div className="mt-4 text-sm text-gray-500 italic">
            <p>No conversations found. Start a new chat!</p>
          </div>
        )}
      </section>
    </aside>
  )
}

export default ChatList
