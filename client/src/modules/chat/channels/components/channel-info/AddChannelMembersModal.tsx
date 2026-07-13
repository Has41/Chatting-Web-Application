import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { Check, Loader2, Plus, Search, UserRound, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@shared/api/api-client"
import { USER_PATHS } from "@shared/constants/apiPaths"
import type { Channel } from "@shared/types"
import type { UserSearchResult } from "../../types/channelInfo"
import { EMPTY_SEARCH_RESULTS, getUserId, getUserLabel } from "../../utils/channelInfo"

interface AddChannelMembersModalProps {
  channel: Channel
  isAdding: boolean
  onClose: () => void
  onAdd: (memberIds: string[]) => Promise<void>
}

const AddChannelMembersModal = ({ channel, isAdding, onClose, onAdd }: AddChannelMembersModalProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [query, setQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const memberIds = useMemo(
    () => new Set(channel.members.flatMap((member) => (getUserId(member) ? [getUserId(member) as string] : []))),
    [channel.members]
  )
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const { data, isFetching, error } = useQuery({
    queryKey: ["channelMemberSearch", query],
    queryFn: async () => {
      const response = await axiosInstance.get<UserSearchResult[]>(USER_PATHS.SEARCH_FRIENDS_USERS, {
        params: { dataToSearch: query.trim() }
      })
      return response.data
    },
    enabled: query.trim().length >= 3
  })
  const searchResults: UserSearchResult[] = data ?? EMPTY_SEARCH_RESULTS

  useEffect(() => {
    if (!error) return
    console.error("Channel member search failed:", error)
  }, [error])

  const candidates = useMemo(
    () => searchResults.filter((candidate) => !memberIds.has(candidate._id)),
    [searchResults, memberIds]
  )

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    if (event.target.value.trim().length < 3) setSelectedIds([])
  }

  const toggleSelected = (userId: string) => {
    setSelectedIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleAdd = async () => {
    if (selectedIds.length === 0) return
    await onAdd(selectedIds)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog?.open) dialog?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-full max-w-lg bg-transparent p-4 backdrop:bg-black/45 backdrop:backdrop-blur-sm"
      aria-label="Add channel members"
      onClose={onClose}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Add members</h3>
            <p className="text-xs text-slate-500">Invite people into {channel.name}.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 focus:ring-2 focus:ring-[#96e6a1] focus:outline-none"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="p-5">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={handleSearchChange}
              autoFocus
              placeholder="Search by username or display name"
              className="h-12 w-full rounded-lg border border-slate-200 bg-white pr-4 pl-11 text-sm text-slate-800 transition outline-none placeholder:text-slate-400 focus:border-[#96e6a1] focus:ring-2 focus:ring-[#96e6a1]/40"
            />
          </label>

          <div className="mt-4 max-h-80 overflow-y-auto">
            {query.trim().length < 3 ? (
              <p className="py-8 text-center text-sm text-slate-500">Type at least 3 characters to find people.</p>
            ) : isFetching ? (
              <div className="space-y-2">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="flex animate-pulse items-center gap-3 rounded-lg p-2">
                    <div className="size-10 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/2 rounded bg-slate-200" />
                      <div className="h-2 w-1/3 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : candidates.length > 0 ? (
              <ul className="space-y-1">
                {candidates.map((candidate) => {
                  const selected = selectedIdSet.has(candidate._id)
                  const avatarUrl = candidate.profilePicture?.url || candidate.avatar || ""

                  return (
                    <li key={candidate._id}>
                      <button
                        type="button"
                        onClick={() => toggleSelected(candidate._id)}
                        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition ${
                          selected ? "bg-green-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <UserRound size={19} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-slate-800">{getUserLabel(candidate)}</p>
                            {candidate.isFriend && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-700">
                                Friend
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-slate-500">@{candidate.username}</p>
                        </div>
                        <span
                          className={`grid size-8 place-items-center rounded-full ${
                            selected ? "bg-[#96e6a1] text-[#102315]" : "border border-slate-200 text-slate-400"
                          }`}
                        >
                          {selected ? <Check size={16} /> : <Plus size={16} />}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">No users found outside this channel.</p>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
          <p className="text-xs font-medium text-slate-500">
            {selectedIds.length} {selectedIds.length === 1 ? "person" : "people"} selected
          </p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={selectedIds.length === 0 || isAdding}
            className="flex h-10 min-w-32 items-center justify-center gap-2 rounded-lg bg-[#96e6a1] px-4 text-sm font-semibold text-[#102315] transition hover:bg-[#86dc92] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Add members
          </button>
        </footer>
      </div>
    </dialog>
  )
}

export default AddChannelMembersModal
