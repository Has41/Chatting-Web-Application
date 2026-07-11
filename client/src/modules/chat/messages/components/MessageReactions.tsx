import { useState } from "react"
import { Minus, Plus, SmilePlus } from "lucide-react"
import type { User } from "@shared/types"

export interface MessageReactionItem {
  user?: string | User
  users?: string[]
  emoji: string
}

interface MessageReactionsProps {
  reactions?: MessageReactionItem[]
  currentUserId?: string
  disabled?: boolean
  align?: "left" | "right"
  onReact: (emoji: string) => void
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"]
const MORE_REACTION_EMOJIS = ["🔥", "👏", "😍", "🤣", "😎", "🤔", "😭", "🎉", "💯", "🙌", "😡", "🤝"]

const getReactionUserId = (reaction: MessageReactionItem) =>
  typeof reaction.user === "string" ? reaction.user : reaction.user?._id

const getUserLabel = (user?: string | User) => {
  if (!user || typeof user === "string") return "Member"
  return user.displayName || user.username || "Member"
}

const getUserAvatar = (user?: string | User) => {
  if (!user || typeof user === "string") return ""
  return user.profilePicture?.url || user.avatar || ""
}

const MessageReactions = ({
  reactions = [],
  currentUserId,
  disabled = false,
  align = "left",
  onReact
}: MessageReactionsProps) => {
  const [showMoreEmojis, setShowMoreEmojis] = useState(false)

  const groupedReactions = reactions.reduce<
    Record<string, { count: number; mine: boolean; users: Array<{ id?: string; label: string; avatarUrl: string }> }>
  >((acc, reaction) => {
    if (!reaction.emoji) return acc

    const current = acc[reaction.emoji] ?? { count: 0, mine: false, users: [] }
    const userId = getReactionUserId(reaction)
    const fallbackUsers =
      !reaction.user && reaction.users?.length
        ? reaction.users.map((id) => ({ id, label: id === currentUserId ? "You" : "Member", avatarUrl: "" }))
        : []
    const reactionUsers = reaction.user
      ? [
          {
            id: userId,
            label: userId === currentUserId ? "You" : getUserLabel(reaction.user),
            avatarUrl: getUserAvatar(reaction.user)
          }
        ]
      : fallbackUsers

    acc[reaction.emoji] = {
      count: current.count + Math.max(reactionUsers.length, 1),
      mine: current.mine || userId === currentUserId || Boolean(reaction.users?.includes(currentUserId ?? "")),
      users: [...current.users, ...reactionUsers]
    }
    return acc
  }, {})

  const reactionEntries = Object.entries(groupedReactions)
  const hasReactions = reactionEntries.length > 0

  return (
    <div
      className={`mt-1 flex flex-wrap items-center gap-1.5 ${
        align === "right" ? "justify-end" : "justify-start"
      } ${!hasReactions && disabled ? "hidden" : ""}`}
    >
      {reactionEntries.map(([emoji, reaction]) => (
        <div key={emoji} className="group/reaction-chip relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onReact(emoji)}
            className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#96e6a1] focus:ring-offset-1 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
              reaction.mine
                ? "border-[#8bdc96] bg-[#e9faec] text-[#1f5f2b]"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
            aria-label={`${reaction.mine ? "Remove" : "Add"} ${emoji} reaction`}
            aria-describedby={`reaction-${emoji.codePointAt(0)}-people`}
          >
            <span aria-hidden="true" className="text-[13px] leading-none">
              {emoji}
            </span>
            <span>{reaction.count}</span>
          </button>

          <div
            id={`reaction-${emoji.codePointAt(0)}-people`}
            role="tooltip"
            className={`pointer-events-none absolute bottom-9 z-40 hidden w-56 rounded-xl border border-slate-200 bg-white p-2 text-left shadow-xl shadow-slate-900/10 group-hover/reaction-chip:block group-focus-within/reaction-chip:block ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            <div className="mb-1 flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-sm leading-none">{emoji}</span>
              <span className="text-xs font-semibold text-slate-500">
                {reaction.count} {reaction.count === 1 ? "reaction" : "reactions"}
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {reaction.users.length > 0 ? (
                reaction.users.map((reactionUser) => (
                  <div key={reactionUser.id ?? reactionUser.label} className="flex items-center gap-2 py-1.5">
                    <div className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e5f8e8] text-[11px] font-bold text-[#2f733c]">
                      {reactionUser.avatarUrl ? (
                        <img src={reactionUser.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        reactionUser.label.slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <span className="min-w-0 truncate text-xs font-semibold text-slate-700">{reactionUser.label}</span>
                  </div>
                ))
              ) : (
                <p className="px-1 py-1 text-xs font-medium text-slate-500">Reaction details unavailable</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {!disabled && (
        <div className="group/reactions relative">
          <button
            type="button"
            className="grid h-7 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#96e6a1] focus:ring-offset-1"
            aria-label="Add reaction"
          >
            <SmilePlus size={15} />
          </button>
          <div
            className={`absolute bottom-9 z-50 hidden w-max max-w-[17rem] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 group-hover/reactions:block group-focus-within/reactions:block ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            <div className="flex items-center gap-0.5">
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onReact(emoji)
                    setShowMoreEmojis(false)
                  }}
                  className="grid h-8 w-8 place-items-center rounded-full text-base transition hover:bg-[#e9faec] focus:outline-none focus:ring-2 focus:ring-[#96e6a1]"
                  aria-label={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowMoreEmojis((value) => !value)}
                className={`ml-1 grid h-8 w-8 place-items-center rounded-full border text-slate-600 transition focus:outline-none focus:ring-2 focus:ring-[#96e6a1] ${
                  showMoreEmojis
                    ? "border-[#8bdc96] bg-[#e9faec] text-[#1f5f2b]"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
                aria-label={showMoreEmojis ? "Hide more reactions" : "Show more reactions"}
                aria-expanded={showMoreEmojis}
              >
                {showMoreEmojis ? <Minus size={15} /> : <Plus size={15} />}
              </button>
            </div>

            {showMoreEmojis && (
              <div className="mt-1 grid grid-cols-6 gap-0.5 border-t border-slate-100 pt-1">
                {MORE_REACTION_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onReact(emoji)
                      setShowMoreEmojis(false)
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-base transition hover:bg-[#e9faec] focus:outline-none focus:ring-2 focus:ring-[#96e6a1]"
                    aria-label={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageReactions
