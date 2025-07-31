import { useEffect, useRef, useState } from "react"
import useIntersectionObserver from "../../../hooks/useIntersectionObserver"
import useAuth from "../../../hooks/useAuth"
import getSeenText from "../../../utils/getSeenText"
import moment from "moment"
import { useMutation } from "react-query"
import axiosInstance from "../../../utils/axiosInstance"
import { MESSAGE_PATHS } from "../../../constants/apiPaths"
import EditMessageModal from "../../Shared/EditMessageModal"
import FileMessagePreview from "../../Shared/FileMessagePreview"

const Message = ({
  isSender,
  message,
  setMessages,
  lastMessage,
  recipientData = [],
  conversationId,
  conversationType,
  socket
}) => {
  const messageRef = useRef(null)
  const hasMarkedSeenRef = useRef(false)
  const { user } = useAuth()
  const isVisible = useIntersectionObserver(messageRef)
  const [messageId, _] = useState(message._id)
  const [editContent, setEditContent] = useState(message.content)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSeenUsernames, setShowSeenUsernames] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const updateMessageInState = (id, newContent) => {
    setMessages((prev) => prev.map((msg) => (msg._id === id ? { ...msg, content: newContent, editedAt: "Edited" } : msg)))
  }

  const { mutate: editMessage } = useMutation({
    mutationFn: async ({ messageId, content }) => {
      return await axiosInstance.patch(`${MESSAGE_PATHS.EDIT_MESSAGE}/${messageId}`, { content })
    },
    onSuccess: () => {
      updateMessageInState(messageId, editContent)
      setShowDropdown(false)
      console.log("Message edited successfully")
    },
    onError: (error) => {
      console.error("Error editing message:", error)
    }
  })

  const { mutate: deleteMessage } = useMutation({
    mutationFn: async (messageId) => {
      return await axiosInstance.delete(`${MESSAGE_PATHS.DELETE_MESSAGE}/${messageId}`)
    },
    onSuccess: () => {
      //Won't be performant if messages are large, but works for now
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId))
      setShowDropdown(false)
      console.log("Message deleted successfully")
    },
    onError: (error) => {
      console.error("Error deleting message:", error)
    }
  })

  useEffect(() => {
    const hasCurrentUserSeen = lastMessage?.seenBy?.some((seen) => seen.user._id === user._id || seen.user?._id === user._id)
    if (
      message?._id === lastMessage?._id &&
      isVisible &&
      !hasCurrentUserSeen &&
      !hasMarkedSeenRef.current &&
      message?.sender !== user?._id
    ) {
      socket.current.emit("markMessageAsSeen", conversationId, user._id, conversationType, lastMessage._id)
      hasMarkedSeenRef.current = true
      console.log("Marked message as seen:", lastMessage)
    }
  }, [isVisible, message, lastMessage, conversationId, user._id, conversationType, socket])

  return (
    <div className={`mb-3 ${isSender ? "flex justify-end" : "flex justify-start"}`}>
      <div className="flex flex-col">
        <div className="group relative flex items-center gap-x-1">
          <div
            ref={messageRef}
            className={`inline-block max-w-full overflow-x-hidden whitespace-normal break-words ${message?.messageType === "file" ? "p-1" : "px-4 py-3"} text-sm shadow ${
              message.messageType === "text"
                ? isSender
                  ? "rounded-sent bg-custom-green text-white"
                  : "rounded-recieved bg-custom-white text-black"
                : isSender
                  ? "rounded bg-custom-green text-white"
                  : "rounded bg-custom-white text-black"
            }`}
          >
            {!isSender && conversationType === "group" && (
              <p className={`mb-2 ${message?.media?.mediaUrl && "p-2"} text-xs font-semibold text-green-600`}>
                {recipientData.find((r) => r._id === message.sender || r._id === message.sender?._id)?.username}
              </p>
            )}
            {message.messageType === "file" ? (
              <FileMessagePreview fileMeta={message.media} isSender={isSender} />
            ) : (
              <div className="flex max-w-96 flex-wrap items-end justify-between gap-x-4 gap-y-4">
                <div className="break-all">{message.content}</div>
                <div className="text-custom-white ml-auto block select-none text-right text-xs">
                  {message.editedAt && <span className="mr-2 text-white">Edited</span>}
                  {moment(message.createdAt).format("h:mm a")}
                </div>
              </div>
            )}
          </div>
          <div>
            <div
              className={`absolute top-1/2 hidden -translate-y-1/2 transform cursor-pointer group-hover:block ${
                isSender ? "-left-5" : "-right-4"
              }`}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
              </svg>
            </div>

            {showDropdown && isSender && (
              <div
                ref={dropdownRef}
                className="absolute -left-14 top-0 z-10 flex flex-col items-center rounded-md border bg-white px-2 py-1 shadow-lg"
              >
                <button
                  onClick={() => {
                    setShowEditModal(true)
                    setShowDropdown(false)
                  }}
                  className="w-full py-1 text-center text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => deleteMessage(message._id)}
                  className="w-full py-1 text-left text-sm text-red-600 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            )}
            {showEditModal && (
              <EditMessageModal
                setEditContent={setEditContent}
                editingMessageId={messageId}
                setShowEditModal={setShowEditModal}
                editMessage={editMessage}
                editContent={editContent}
              />
            )}
          </div>
        </div>
        {message?._id === lastMessage?._id && lastMessage?.sender === user?._id && lastMessage?.seenBy?.length > 0 && (
          <div className="mt-2 flex flex-col items-end text-xs font-medium text-gray-600">
            {conversationType === "group" ? (
              <>
                <div
                  className="flex cursor-pointer -space-x-2"
                  onClick={() => setShowSeenUsernames((prev) => !prev)}
                  title="Seen by"
                >
                  {lastMessage.seenBy.map((seen) => (
                    <img
                      key={seen._id}
                      src={seen.user?.profilePicture?.url || "/default-avatar.png"}
                      alt={seen.user?.username}
                      className="size-7 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>

                {showSeenUsernames && (
                  <div className="mt-2 flex max-w-[12rem] animate-fadeIn rounded bg-gray-100 px-2 py-1 transition-all duration-300 ease-in-out">
                    <p className="">Seen by: </p>
                    <ul className="flex flex-wrap justify-end text-right">
                      {lastMessage.seenBy.map((seen, index) => (
                        <>
                          <li className="ml-1" key={seen._id}>
                            {seen.user?.username}
                          </li>
                          {index < lastMessage?.seenBy?.length - 1 && ", "}
                        </>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>{getSeenText(lastMessage.seenBy[0].seenAt)}</>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message
