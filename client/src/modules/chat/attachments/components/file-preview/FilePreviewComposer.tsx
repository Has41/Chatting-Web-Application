import LoadingSpinner from "@shared/components/LoadingSpinner"

interface FilePreviewComposerProps {
  caption: string
  isSending: boolean
  onCaptionChange: (caption: string) => void
  onSend: () => void
}

const FilePreviewComposer = ({ caption, isSending, onCaptionChange, onSend }: FilePreviewComposerProps) => (
  <div className="flex items-center justify-center gap-2">
    <input
      type="text"
      value={caption}
      onChange={(event) => onCaptionChange(event.target.value)}
      placeholder="Add a caption..."
      className="w-[70%] rounded border px-3 py-2 text-sm focus:outline-none"
    />
    <button
      type="button"
      onClick={onSend}
      className="bg-custom-green flex items-center justify-center rounded-full p-3 text-white transition-all duration-500 hover:bg-green-400"
      aria-label="Send file"
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
)

export default FilePreviewComposer
