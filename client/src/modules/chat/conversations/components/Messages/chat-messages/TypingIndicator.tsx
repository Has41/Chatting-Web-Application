import type { TypingUser } from "@chat/socket/useChatSocket"

interface TypingIndicatorProps {
  typingUsers: TypingUser[]
  avatarUrl?: string
  avatarLabel?: string
}

const TypingIndicator = ({ typingUsers, avatarUrl, avatarLabel }: TypingIndicatorProps) => {
  if (!typingUsers.length) return null

  const fallbackLabel = (avatarLabel || typingUsers[0]?.username || "?").charAt(0).toUpperCase()

  return (
    <div className="flex items-end justify-start">
      <div className="mr-2 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-300 text-xs font-semibold text-white">
        {avatarUrl ? (
          <img src={avatarUrl} alt={avatarLabel || "Typing user"} className="size-full object-cover" />
        ) : (
          fallbackLabel
        )}
      </div>
      <div className="bg-custom-white flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <span className="size-2 animate-pulse rounded-full bg-slate-400 [animation-delay:-0.2s]" />
        <span className="size-2 animate-pulse rounded-full bg-slate-400 [animation-delay:-0.1s]" />
        <span className="size-2 animate-pulse rounded-full bg-slate-400" />
      </div>
    </div>
  )
}

export default TypingIndicator
