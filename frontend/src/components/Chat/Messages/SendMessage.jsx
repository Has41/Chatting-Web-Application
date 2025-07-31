import { useRef, useState } from "react"
import AttachmentMenu from "../../Shared/AttachmentMenu"
import FilePreviewModal from "../FilePreviewModal"
import useAuth from "../../../hooks/useAuth"

const SendMessage = ({
  setMessageContent,
  messageContent,
  recipientId,
  socketRef,
  conversationType = "private",
  conversationId,
  sendMessage
}) => {
  const { user } = useAuth()
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)
  const [attachmentType, setAttachmentType] = useState(null)
  const fileInputRef = useRef(null)

  const handleAttachmentSelect = (type) => {
    setAttachmentType(type)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewFile(file)
    // handleSendFile({ type: attachmentType, file })
    e.target.value = null
  }

  const handleSendMessage = ({ conversationId, messageContent, messageType, fileMeta }) => {
    console.log(conversationId)

    if (!messageContent?.trim() && !fileMeta) return

    let fileData = {}

    const messageData = {
      conversationId,
      sender: user._id,
      content: messageContent || "",
      recipient: recipientId,
      messageType,
      conversationType
    }

    if (messageType === "file" && fileMeta) {
      fileData = {
        publicId: fileMeta.public_url,
        url: fileMeta.media_url,
        caption: fileMeta.caption || "",
        thumbnailUrl: fileMeta.thumbnailUrl || ""
      }
    }

    if (socketRef.current) {
      sendMessage({ messageData, fileData })
    }
    setMessageContent("")
  }

  const getAcceptedTypes = (type) => {
    switch (type) {
      case "image":
        return "image/*"
      case "video":
        return "video/*"
      case "document":
        return ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
      case "audio":
        return "audio/*"
      default:
        return "*"
    }
  }

  return (
    <div className="relative flex max-w-full items-center gap-3 border-t p-4">
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          type={attachmentType}
          recipientId={recipientId}
          conversationId={conversationId}
          conversationType={conversationType}
          onSend={handleSendMessage}
          onCancel={() => setPreviewFile(null)}
        />
      )}
      <div className="w-[5%]">
        <button className="rounded-full p-3 text-black/80 transition-all duration-500 hover:text-custom-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
            />
          </svg>
        </button>
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        className="w-3/4 rounded-md border border-slate-200 p-3 text-sm focus:outline-none"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage({
              conversationId,
              messageContent,
              messageType: "text"
            })
          }
        }}
      />

      <div className="flex w-1/6 gap-x-1">
        {showAttachmentOptions && (
          <AttachmentMenu
            onSelect={(type) => {
              handleAttachmentSelect(type)
              setShowAttachmentOptions(false)
            }}
            onClose={() => setShowAttachmentOptions(false)}
          />
        )}
        {/* File icon */}
        <button
          onClick={() => setShowAttachmentOptions((prev) => !prev)}
          className="rounded-full p-3 text-black/80 transition-all duration-500 hover:text-custom-text"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={getAcceptedTypes(attachmentType)}
            onChange={handleFileChange}
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
            />
          </svg>
        </button>
        {/* Emoji icon */}
        <button className="rounded-full p-3 text-black/80 transition-all duration-500 hover:text-custom-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75"
            />
          </svg>
        </button>
        <button
          onClick={() => handleSendMessage({ conversationId, messageContent, messageType: "text" })}
          className="rounded-full bg-custom-green p-3 text-white transition-all duration-500 hover:bg-green-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default SendMessage
