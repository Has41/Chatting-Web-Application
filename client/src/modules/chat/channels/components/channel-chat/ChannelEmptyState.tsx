import { Hash } from "lucide-react"

interface ChannelEmptyStateProps {
  isPublicPreview: boolean
}

const ChannelEmptyState = ({ isPublicPreview }: ChannelEmptyStateProps) => (
  <div className="flex h-full items-center justify-center text-center">
    <div>
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-white text-[#4f8f59] shadow-sm">
        <Hash size={28} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-[#18251b]">Start the channel</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#6c7d70]">
        {isPublicPreview
          ? "This public channel is open to preview. Join when you want to take part."
          : "Send the first message and this space will come alive for everyone inside it."}
      </p>
    </div>
  </div>
)

export default ChannelEmptyState
