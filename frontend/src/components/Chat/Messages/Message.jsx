import React, { useEffect, useRef } from "react"
import useIntersectionObserver from "../../../hooks/useIntersectionObserver"
import useAuth from "../../../hooks/useAuth"
import getSeenText from "../../../utils/getSeenText"
import moment from "moment"

const Message = ({ isSender, message, lastMessage, conversationId, conversationType, socket }) => {
  const messageRef = useRef(null)
  const hasMarkedSeenRef = useRef(false)
  const { user } = useAuth()
  const isVisible = useIntersectionObserver(messageRef)

  useEffect(() => {
    console.log(lastMessage)
  }, [lastMessage])

  useEffect(() => {
    if (message._id === lastMessage._id && isVisible && lastMessage.seenBy.length === 0 && !hasMarkedSeenRef.current) {
      socket.current.emit("markMessageAsSeen", conversationId, user._id, conversationType, lastMessage._id)
      hasMarkedSeenRef.current = true
      console.log(lastMessage)
    }
  }, [isVisible, message, lastMessage, conversationId, user._id, conversationType, socket])

  return (
    <div className={`mb-3 ${isSender ? "flex justify-end" : "flex justify-start"}`}>
      <div className="flex flex-col">
        <div
          ref={messageRef}
          className={`inline-block max-w-full overflow-x-hidden whitespace-normal break-words px-4 py-3 text-sm shadow ${
            isSender ? "rounded-sent bg-custom-green text-white" : "rounded-recieved bg-custom-white text-black"
          }`}
        >
          <div className="flex max-w-96 flex-wrap items-end justify-between gap-x-4 gap-y-4">
            <div className="break-all">{message.content}</div>
            <div className="text-custom-white ml-auto block select-none text-right text-xs">
              {moment(message.createdAt).format("h:mm a")}
            </div>
          </div>
        </div>
        {message._id === lastMessage._id && lastMessage.seenBy.length > 0 && lastMessage.sender === user._id && (
          <div className="mt-2 text-right text-xs font-medium text-gray-600">
            {lastMessage.seenBy.map((seen) => (
              <div key={seen._id}>{getSeenText(seen.seenAt)}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message
