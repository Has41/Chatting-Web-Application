import { Hash, Lock, Users } from "lucide-react"
import type { Channel } from "@shared/types"
import JoinChannelButton from "./JoinChannelButton"

interface ChannelHeaderProps {
  channel: Channel
  VisibilityIcon: typeof Hash
  isPublicPreview: boolean
  isJoining: boolean
  onOpenInfo: () => void
  onJoin: () => void
}

const ChannelHeader = ({ channel, VisibilityIcon, isPublicPreview, isJoining, onOpenInfo, onJoin }: ChannelHeaderProps) => (
  <header className="flex min-h-19.5 items-center justify-between border-b border-black/5 bg-white px-5 shadow-sm">
    <button
      type="button"
      onClick={onOpenInfo}
      className="flex min-w-0 items-center gap-3 rounded-lg text-left transition hover:bg-slate-50 focus:ring-2 focus:ring-[#96e6a1] focus:outline-none"
      aria-label="Open channel info"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#e5f8e8] text-[#2f733c]">
        {channel.avatar?.url ? (
          <img src={channel.avatar.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <VisibilityIcon size={22} />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-lg font-semibold text-[#18251b]">{channel.name}</h1>
          {channel.visibility === "private" && <Lock size={15} className="shrink-0 text-[#8a9a8d]" />}
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-[#65786a]">
          <Users size={14} />
          <span>{channel.members.length} members</span>
          {channel.description && (
            <>
              <span className="h-1 w-1 rounded-full bg-[#a3b0a6]" />
              <span className="truncate">{channel.description}</span>
            </>
          )}
        </div>
      </div>
    </button>
    {isPublicPreview && <JoinChannelButton label="Join" isJoining={isJoining} onJoin={onJoin} className="ml-4" />}
  </header>
)

export default ChannelHeader
