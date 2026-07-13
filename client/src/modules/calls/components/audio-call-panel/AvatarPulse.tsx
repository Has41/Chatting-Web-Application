import type { User } from "@shared/types"

interface AvatarPulseProps {
  peer?: User | null
  peerName: string
  isCallLive: boolean
  size: "normal" | "large"
}

const AvatarPulse = ({ peer, peerName, isCallLive, size }: AvatarPulseProps) => {
  const avatarSize = size === "large" ? "size-28 text-4xl" : "size-24 text-3xl"

  return (
    <div className="relative">
      {!isCallLive && (
        <>
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20 motion-reduce:animate-none" />
          <span className="absolute -inset-3 rounded-full bg-emerald-300/10" />
        </>
      )}
      {peer?.profilePicture?.url ? (
        <img
          src={peer.profilePicture.url}
          alt=""
          className={`relative ${avatarSize} rounded-full border-4 border-white/15 object-cover shadow-xl`}
        />
      ) : (
        <div
          className={`relative flex ${avatarSize} items-center justify-center rounded-full border-4 border-white/15 bg-slate-700 font-semibold text-white shadow-xl`}
        >
          {peerName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

export default AvatarPulse
