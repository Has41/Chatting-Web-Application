import { type ChangeEvent, type Dispatch, type FormEvent, type RefObject, type SetStateAction } from "react"
import { Lock, Paperclip, Send } from "lucide-react"
import type { FileType, SendMessagePayload } from "@chat/attachments/types/attachments"
import AttachmentMenu from "@chat/composer/components/AttachmentMenu"
import FilePreviewModal from "@chat/attachments/components/FilePreviewModal"
import { getAcceptedTypes } from "../../utils/channelChat"
import JoinChannelButton from "./JoinChannelButton"

interface ChannelComposerFooterProps {
  channelName: string
  channelId: string
  messageText: string
  attachmentType: FileType | null
  previewFile: File | null
  composerState: {
    attachmentMenu: "open" | "closed"
    permission: "allowed" | "blocked"
    previewMode: "public" | "member"
    join: "pending" | "idle"
  }
  fileInputRef: RefObject<HTMLInputElement | null>
  onJoin: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onMessageChange: (value: string) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSendFile: (payload: SendMessagePayload) => void
  onCancelPreview: () => void
  onAttachmentSelect: (type: FileType) => void
  setShowAttachmentOptions: Dispatch<SetStateAction<boolean>>
}

const ChannelComposerFooter = ({
  channelName,
  channelId,
  messageText,
  attachmentType,
  previewFile,
  composerState,
  fileInputRef,
  onJoin,
  onSubmit,
  onMessageChange,
  onFileChange,
  onSendFile,
  onCancelPreview,
  onAttachmentSelect,
  setShowAttachmentOptions
}: ChannelComposerFooterProps) => (
  <footer className="border-t border-black/5 bg-white px-5 py-4">
    <div className="relative mx-auto max-w-3xl">
      {composerState.previewMode === "public" ? (
        <PublicPreviewJoinPrompt joinState={composerState.join} onJoin={onJoin} />
      ) : (
        composerState.permission === "blocked" && <AdminOnlyNotice />
      )}
      {composerState.previewMode === "member" && (
        <>
          {previewFile && (
            <FilePreviewModal
              file={previewFile}
              type={attachmentType ?? "document"}
              conversationId={channelId}
              conversationType="channel"
              onSend={onSendFile}
              onCancel={onCancelPreview}
            />
          )}
          <form onSubmit={onSubmit} className="flex items-end gap-3">
            {composerState.attachmentMenu === "open" && (
              <AttachmentMenu
                onSelect={(type) => {
                  onAttachmentSelect(type)
                  setShowAttachmentOptions(false)
                }}
                onClose={() => setShowAttachmentOptions(false)}
              />
            )}
            <button
              type="button"
              onClick={() => setShowAttachmentOptions((prev) => !prev)}
              disabled={composerState.permission === "blocked"}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#506856] transition hover:bg-[#f1f6f2] focus:ring-2 focus:ring-[#96e6a1] focus:outline-none disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Attach file"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={getAcceptedTypes(attachmentType)}
              onChange={onFileChange}
            />
            <div className="flex min-h-12 flex-1 items-center rounded-3xl bg-[#f1f6f2] px-4 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-[#96e6a1]">
              <textarea
                value={messageText}
                onChange={(event) => onMessageChange(event.target.value)}
                onKeyDown={(event) => {
                  if (composerState.permission === "blocked") return
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    event.currentTarget.form?.requestSubmit()
                  }
                }}
                disabled={composerState.permission === "blocked"}
                rows={1}
                aria-label={`Message ${channelName}`}
                placeholder={composerState.permission === "allowed" ? `Message ${channelName}` : "Admins only"}
                className="max-h-32 min-h-6 w-full resize-none bg-transparent py-3 text-sm text-[#18251b] outline-none placeholder:text-[#9aa99d] disabled:cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              disabled={!messageText.trim() || composerState.permission === "blocked"}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#96e6a1] text-[#102315] shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send channel message"
            >
              <Send size={20} />
            </button>
          </form>
        </>
      )}
    </div>
  </footer>
)

const PublicPreviewJoinPrompt = ({ joinState, onJoin }: { joinState: "pending" | "idle"; onJoin: () => void }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f1f6f2] px-4 py-3 ring-1 ring-black/5">
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[#18251b]">Previewing public channel</p>
      <p className="mt-1 text-xs font-medium text-[#65786a]">Join to send messages, files, and typing updates.</p>
    </div>
    <JoinChannelButton label="Join channel" isJoining={joinState === "pending"} onJoin={onJoin} />
  </div>
)

const AdminOnlyNotice = () => (
  <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
    <Lock size={14} />
    Only channel admins can send messages here.
  </div>
)

export default ChannelComposerFooter
