import { Hash, Loader2 } from "lucide-react"

export const ChannelPickerState = () => (
  <section className="flex h-screen flex-1 items-center justify-center bg-[#f8fbf8]">
    <p className="text-sm text-[#6c7d70]">Pick a channel to open the conversation.</p>
  </section>
)

export const ChannelLoadingState = () => (
  <section className="flex h-screen flex-1 items-center justify-center bg-[#f8fbf8]">
    <Loader2 className="animate-spin text-[#4f8f59]" size={26} />
  </section>
)

export const ChannelUnavailableState = () => (
  <section className="flex h-screen flex-1 items-center justify-center bg-[#f8fbf8] px-6 text-center">
    <div>
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#4f8f59] shadow-sm">
        <Hash size={24} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-[#18251b]">Channel unavailable</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#6c7d70]">
        This channel might be private, deleted, or not available to your account.
      </p>
    </div>
  </section>
)
