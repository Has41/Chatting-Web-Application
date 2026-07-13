import { Loader2, Users } from "lucide-react"

interface JoinChannelButtonProps {
  label: string
  isJoining: boolean
  onJoin: () => void
  className?: string
}

const JoinChannelButton = ({ label, isJoining, onJoin, className = "" }: JoinChannelButtonProps) => (
  <button
    type="button"
    onClick={onJoin}
    disabled={isJoining}
    className={`${className} flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#96e6a1] px-4 text-sm font-semibold text-[#102315] transition hover:bg-[#84dc91] focus:ring-2 focus:ring-[#96e6a1] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60`}
  >
    {isJoining ? <Loader2 size={16} className="animate-spin" /> : <Users size={16} />}
    {label}
  </button>
)

export default JoinChannelButton
