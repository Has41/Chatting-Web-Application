import type { TypingUser } from "@chat/conversations/hooks/useChatSocket"

interface TypingIndicatorProps {
  typingUsers: TypingUser[]
}

const TypingIndicator = ({ typingUsers }: TypingIndicatorProps) => {
  if (!typingUsers.length) return null

  return (
    <div className="mb-3 flex justify-start">
      <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-custom-white px-4 py-3 shadow-sm">
        <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
        <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
        <span className="size-2 animate-bounce rounded-full bg-slate-400" />
      </div>
    </div>
  )
}

export default TypingIndicator
