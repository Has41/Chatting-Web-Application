import { useState } from "react"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import moment from "moment"
import GroupModal from "../Shared/GroupModal"
import ChatSearch from "./Messages/ChatSearch"
import { getChatConversationRoute, getGroupConversationRoute } from "../../constants/routePaths"
import useChatList from "../../hooks/useChatList"

const ChatList = () => {
  const { user } = useAuth()
  const { chatList } = useChatList()
  const [showDropdown, setShowDropdown] = useState(false)
  const [openGroupModal, setOpenGroupModal] = useState(false)

  const toggleDropdown = () => setShowDropdown((prev) => !prev)

  return (
    <aside
      className="h-screen w-1/4 border-l border-r border-l-slate-200 border-r-slate-200 bg-gray-50 font-poppins"
      aria-label="Chat List"
    >
      <section className="px-4 py-6">
        <div className="relative mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black/80">Chats</h2>
          <div className="relative">
            <svg
              onClick={toggleDropdown}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 cursor-pointer text-black/80"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>

            {showDropdown && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                <button
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
        <div className="my-8">
          <div className="relative flex h-14 w-[5rem] flex-col items-center justify-center rounded-lg bg-slate-100 shadow-sm">
            <div className="relative">
              <div className="-mt-5 mb-1 size-12 cursor-pointer rounded-full bg-green-200"></div>
              <span className="absolute bottom-1 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
            </div>
            <p className="text-sm font-semibold text-black/80">User</p>
          </div>
        </div>

        <div className="max-w-full">
          <div>
            <h1 className="mb-4 font-semibold text-black/80">Recent</h1>
          </div>
          {/* Here fix from backend to exclude current User */}
          {chatList &&
            chatList.map((conversation) => {
              const isGroup = conversation.conversationType === "group"

              const otherUser = !isGroup ? conversation.participants.find((p) => p._id !== user._id) : null

              const imageUrl = isGroup ? conversation.groupPicture?.url : otherUser?.profilePicture?.url

              const displayName = isGroup ? conversation.groupName : otherUser?.displayName || otherUser?.username

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
                          <img
                            className="mr-3 h-12 w-12 rounded-full bg-slate-200 object-cover"
                            src={imageUrl}
                            alt={displayName}
                          />
                        ) : (
                          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-white">
                            {displayName?.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="max-w-[9rem] truncate font-semibold text-gray-800" title={displayName}>
                            {displayName}
                          </div>

                          <div
                            className="max-w-[9rem] truncate text-xs text-gray-600"
                            title={conversation?.lastMessage?.content}
                          >
                            {conversation?.lastMessage?.content || "No messages yet"}
                          </div>
                        </div>

                        {conversation?.lastMessage?.createdAt && (
                          <div className="mb-auto flex flex-col text-xs text-gray-500">
                            <p>{moment(conversation?.lastMessage?.createdAt).format("h:mm a")}</p>
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
          <div className="mt-4 text-sm italic text-gray-500">
            <p>No conversations found. Start a new chat!</p>
          </div>
        )}
      </section>
    </aside>
  )
}

export default ChatList
