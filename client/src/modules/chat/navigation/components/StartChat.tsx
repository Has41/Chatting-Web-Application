import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import ChatLogo from "@shared/components/ChatLogo"
import UserSearch from "@/modules/chat/conversations/components/messages/UserSearch"

const SUGGESTIONS = [
  {
    title: "Pick a conversation",
    description: "Choose any recent chat from the left panel to continue where you left off."
  },
  {
    title: "Find people",
    description: "Search for any user and open a private chat directly."
  },
  {
    title: "Create a group",
    description: "Open the chat menu to bring multiple people into one conversation."
  }
]

const StartChat = () => {
  const [showSearchModal, setShowSearchModal] = useState(false)
  const searchDialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const dialog = searchDialogRef.current
    if (!dialog) return

    if (showSearchModal && !dialog.open) {
      dialog.showModal()
    } else if (!showSearchModal && dialog.open) {
      dialog.close()
    }
  }, [showSearchModal])

  return (
    <section className="font-poppins relative flex h-screen flex-1 overflow-hidden bg-[#f7f8fb]" aria-label="Start chat">
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-r from-emerald-100 via-sky-100 to-violet-100" />
      <div className="absolute top-16 right-14 h-36 w-36 rounded-full border border-white/80 bg-white/40 blur-2xl" />
      <div className="absolute bottom-16 left-16 h-28 w-28 rounded-full border border-white/80 bg-emerald-100/60 blur-2xl" />

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-8 py-10">
        <div className="mb-8 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <ChatLogo size="size-7" />
          <span className="text-sm font-semibold text-slate-700">ChatConnect</span>
        </div>

        <div className="relative mb-8 h-44 w-72">
          <div className="absolute top-5 left-3 max-w-48 rounded-2xl rounded-bl-sm bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 h-2 w-28 rounded-full bg-slate-200" />
            <div className="h-2 w-20 rounded-full bg-slate-100" />
          </div>
          <div className="absolute right-4 bottom-8 max-w-52 rounded-2xl rounded-br-sm bg-emerald-400 px-5 py-4 shadow-sm">
            <div className="mb-3 h-2 w-32 rounded-full bg-white/75" />
            <div className="h-2 w-24 rounded-full bg-white/50" />
          </div>
          <div className="absolute bottom-0 left-20 flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span className="h-2 w-2 rounded-full bg-violet-400" />
          </div>
        </div>

        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-slate-900">Start a conversation</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Search for someone, open a draft chat, and send the first message when you are ready.
          </p>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400"
          >
            <Search className="size-4" />
            Find people
          </button>
        </div>

        <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-3">
          {SUGGESTIONS.map((suggestion) => (
            <article key={suggestion.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800">{suggestion.title}</h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">{suggestion.description}</p>
            </article>
          ))}
        </div>
      </div>

      <dialog
        ref={searchDialogRef}
        className="m-auto w-full max-w-xl overflow-visible bg-transparent p-4 backdrop:bg-black/55 backdrop:backdrop-blur-sm"
        aria-label="Find people"
        onClose={() => setShowSearchModal(false)}
      >
        <div className="w-full overflow-hidden rounded-lg bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Find people</h2>
              <p className="text-xs text-slate-500">Search users and open a private chat.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSearchModal(false)}
              className="inline-flex size-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="p-4">
            <UserSearch variant="panel" placeholder="Search by username or display name" autoFocus />
          </div>
        </div>
      </dialog>
    </section>
  )
}

export default StartChat
