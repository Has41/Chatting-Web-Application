interface ChatListAvatarProps {
  imageUrl?: string
  displayName?: string
  initial?: string
  showPresence: boolean
  isOnline: boolean
}

const ChatListAvatar = ({ imageUrl, displayName, initial, showPresence, isOnline }: ChatListAvatarProps) => (
  <div className="relative mr-3">
    {imageUrl ? (
      <img className="h-12 w-12 rounded-full bg-slate-200 object-cover" src={imageUrl} alt={displayName} />
    ) : (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-white">
        {initial}
      </div>
    )}
    {showPresence && (
      <span
        className={`absolute right-0 bottom-0 size-3 rounded-full border-2 border-white ${
          isOnline ? "bg-emerald-500" : "bg-gray-300"
        }`}
      />
    )}
  </div>
)

export default ChatListAvatar
