import { FormEvent, useMemo, useState } from "react"
import { Hash, Lock, Plus, Search, Users, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "@auth/hooks/useAuth"
import { getChannelConversationRoute } from "@shared/constants/routePaths"
import type { Channel, User } from "@shared/types"
import { useCreateChannel, useJoinChannel, useMyChannels, usePublicChannels } from "@chat/channels/queries/useChannels"

const getUserId = (value: User | string) => (typeof value === "string" ? value : value._id)

const isMember = (channel: Channel, userId?: string) => {
  if (!userId) return false
  return channel.members.some((member) => getUserId(member) === userId)
}

const ChannelsList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"my" | "explore">("my")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const myChannels = useMyChannels()
  const publicChannels = usePublicChannels(query.trim())
  const joinChannel = useJoinChannel()

  const visibleChannels = activeTab === "my" ? myChannels.data ?? [] : publicChannels.data ?? []
  const isLoading = activeTab === "my" ? myChannels.isLoading : publicChannels.isLoading

  const filteredMyChannels = useMemo(() => {
    if (activeTab !== "my" || !query.trim()) return visibleChannels
    const normalizedQuery = query.trim().toLowerCase()
    return visibleChannels.filter((channel) =>
      `${channel.name} ${channel.description ?? ""}`.toLowerCase().includes(normalizedQuery)
    )
  }, [activeTab, query, visibleChannels])

  const channelsToRender = activeTab === "my" ? filteredMyChannels : visibleChannels

  const handleJoin = async (channel: Channel) => {
    await joinChannel.mutateAsync(channel._id)
    navigate(getChannelConversationRoute(channel._id))
  }

  return (
    <section className="relative flex h-screen w-1/4 min-w-[320px] max-w-[420px] shrink-0 flex-col border-r border-black/5 bg-[#f7fbf8] font-poppins">
      <header className="border-b border-black/5 px-5 pb-4 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f8f59]">Channels</p>
            <h2 className="mt-1 text-2xl font-semibold text-[#18251b]">Spaces</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#96e6a1] text-[#102315] shadow-sm transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#96e6a1] focus:ring-offset-2"
            aria-label="Create channel"
          >
            <Plus size={20} />
          </button>
        </div>

        <label className="mt-5 flex h-11 items-center gap-3 rounded-full bg-white px-4 text-[#78907d] shadow-sm ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-[#96e6a1]">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={activeTab === "my" ? "Search your channels" : "Find public channels"}
            className="w-full bg-transparent text-sm text-[#18251b] outline-none placeholder:text-[#9aa99d]"
          />
        </label>

        <div className="mt-4 grid grid-cols-2 rounded-full bg-white p-1 text-sm font-medium text-[#66816b] ring-1 ring-black/5">
          <button
            type="button"
            onClick={() => setActiveTab("my")}
            className={`rounded-full px-3 py-2 transition ${
              activeTab === "my" ? "bg-[#18251b] text-white shadow-sm" : "hover:text-[#18251b]"
            }`}
          >
            My channels
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("explore")}
            className={`rounded-full px-3 py-2 transition ${
              activeTab === "explore" ? "bg-[#18251b] text-white shadow-sm" : "hover:text-[#18251b]"
            }`}
          >
            Explore
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <ChannelListSkeleton />
        ) : channelsToRender.length > 0 ? (
          <div className="space-y-2">
            {channelsToRender.map((channel) => (
              <ChannelListItem
                key={channel._id}
                channel={channel}
                userId={user?._id}
                joining={joinChannel.isPending}
                onJoin={() => handleJoin(channel)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 px-5 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#4f8f59] shadow-sm">
              <Hash size={24} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#18251b]">
              {activeTab === "my" ? "No channels yet" : "No public channels found"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#738277]">
              {activeTab === "my"
                ? "Create a space for updates, ideas, or a small community."
                : "Try another search or create the first one yourself."}
            </p>
          </div>
        )}
      </div>

      {showCreateModal && <CreateChannelModal onClose={() => setShowCreateModal(false)} />}
    </section>
  )
}

interface ChannelListItemProps {
  channel: Channel
  userId?: string
  joining: boolean
  onJoin: () => void
}

const ChannelListItem = ({ channel, userId, joining, onJoin }: ChannelListItemProps) => {
  const member = isMember(channel, userId)
  const Icon = channel.visibility === "private" ? Lock : Hash

  const content = (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#e5f8e8] text-[#2f733c]">
        {channel.avatar?.url ? (
          <img src={channel.avatar.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon size={21} />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-[#18251b]">{channel.name}</p>
          {channel.visibility === "private" && <Lock size={13} className="shrink-0 text-[#8a9a8d]" />}
        </div>
        <p className="mt-1 truncate text-xs text-[#748278]">{channel.description || "A fresh channel space"}</p>
        <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#5f7564]">
          <Users size={13} />
          <span>{channel.members.length} members</span>
        </div>
      </div>
    </div>
  )

  if (member) {
    return (
      <Link
        to={getChannelConversationRoute(channel._id)}
        className="flex items-center gap-3 rounded-[18px] bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#96e6a1]"
      >
        {content}
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-white p-3 shadow-sm ring-1 ring-black/5">
      <Link
        to={getChannelConversationRoute(channel._id)}
        className="min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#96e6a1]"
      >
        {content}
      </Link>
      <button
        type="button"
        onClick={onJoin}
        disabled={joining}
        className="shrink-0 rounded-full bg-[#18251b] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#25402b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Join
      </button>
    </div>
  )
}

const CreateChannelModal = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate()
  const createChannel = useCreateChannel()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private">("public")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return

    const result = await createChannel.mutateAsync({
      name: name.trim(),
      description: description.trim() || undefined,
      visibility
    })

    onClose()
    navigate(getChannelConversationRoute(result.channel._id))
  }

  return (
    <div className="absolute inset-0 z-30 flex items-end bg-black/20 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-[24px] bg-white p-5 shadow-2xl ring-1 ring-black/10 sm:max-w-md"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#18251b]">Create channel</h3>
            <p className="mt-1 text-sm text-[#6e7f72]">Start a shared space for broadcasts or community chats.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-[#6e7f72] transition hover:bg-[#f0f4f1] focus:outline-none focus:ring-2 focus:ring-[#96e6a1]"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b806f]">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              className="mt-2 h-11 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-[#96e6a1] focus:ring-2 focus:ring-[#96e6a1]/40"
              placeholder="design-club"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b806f]">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={180}
              className="mt-2 w-full resize-none rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-[#96e6a1] focus:ring-2 focus:ring-[#96e6a1]/40"
              placeholder="What is this channel about?"
            />
          </label>

          <div className="grid grid-cols-2 rounded-2xl bg-[#f3f8f4] p-1 text-sm font-semibold text-[#5d7162]">
            <button
              type="button"
              onClick={() => setVisibility("public")}
              className={`rounded-xl px-3 py-2 transition ${
                visibility === "public" ? "bg-white text-[#18251b] shadow-sm" : "hover:text-[#18251b]"
              }`}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => setVisibility("private")}
              className={`rounded-xl px-3 py-2 transition ${
                visibility === "private" ? "bg-white text-[#18251b] shadow-sm" : "hover:text-[#18251b]"
              }`}
            >
              Private
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim() || createChannel.isPending}
          className="mt-5 h-11 w-full rounded-full bg-[#96e6a1] text-sm font-semibold text-[#102315] transition hover:bg-[#84dc91] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createChannel.isPending ? "Creating..." : "Create channel"}
        </button>
      </form>
    </div>
  )
}

const ChannelListSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center gap-3 rounded-[18px] bg-white p-3 ring-1 ring-black/5">
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-[#e8f1ea]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/5 animate-pulse rounded-full bg-[#e8f1ea]" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-[#eef4ef]" />
        </div>
      </div>
    ))}
  </div>
)

export default ChannelsList
