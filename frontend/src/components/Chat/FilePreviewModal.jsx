import { useEffect, useState } from "react"
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload"
import { ROOT_FOLDER } from "../../constants/constantValues"
import useAuth from "../../hooks/useAuth"
import LoadingSpinner from "../Shared/LoadingSpinner"
import PDFPreview from "../Shared/PDFPreview"

const FilePreviewModal = ({ file, type, onCancel, recipientId, onSend, conversationId, conversationType }) => {
  const { user } = useAuth()
  const { uploadFile } = useCloudinaryUpload()
  const [isVisible, setIsVisible] = useState(false)
  const [caption, setCaption] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setUrl(objectUrl)
      console.log(file)

      setIsVisible(true)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onCancel, 200)
  }

  const handleFileSend = async () => {
    if (!file) return
    setIsSending(true)
    const res = await uploadFile(
      file,
      conversationType === "private"
        ? `${ROOT_FOLDER}/${user?._id}/chat-uploads/chat-with-${recipientId}`
        : `${ROOT_FOLDER}/${user?._id}/chat-uploads/group-${conversationId}`,
      file.type,
      type
    )

    if (res.secure_url) {
      const fileMeta = {
        public_url: res.public_id,
        media_url: res.secure_url,
        caption,
        thumbnailUrl: res?.eager[0]?.secure_url || ""
      }

      onSend({
        messageType: "file",
        fileMeta,
        conversationId
      })
    } else {
      console.error("Upload succeeded but no secure_url in response", res)
    }

    setIsSending(false)
    handleClose()
  }

  if (!file || !url) return null

  return (
    <div
      className={`absolute bottom-full left-0 z-50 w-full border-b border-t border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">Preview</h3>
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <div className="my-4 flex justify-center">
        {type === "image" && (
          <div className="flex h-64 w-full items-center justify-center overflow-hidden">
            <img src={url} alt="preview" className="max-h-full max-w-full rounded object-contain" />
          </div>
        )}
        {type === "video" && <video src={url} controls className="max-h-48 rounded" />}
        {type === "audio" && <audio src={url} controls className="w-full" />}
        {type === "document" && (
          <div className="flex h-72 w-full items-center justify-center rounded p-4">
            {file.type === "application/pdf" ? (
              <PDFPreview fileUrl={url} />
            ) : (
              <div className="text-center text-sm text-gray-600">
                <p className="mb-1">No preview available</p>
                <p className="text-xs text-gray-400">{file.name}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-2">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          className="w-[70%] rounded border px-3 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={handleFileSend}
          className="flex items-center justify-center rounded-full bg-custom-green p-3 text-white transition-all duration-500 hover:bg-green-400"
        >
          <LoadingSpinner
            size="size-5"
            color="text-white"
            fill="fill-current"
            loading={isSending}
            finalText={
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
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            }
          />
        </button>
      </div>
    </div>
  )
}

export default FilePreviewModal
