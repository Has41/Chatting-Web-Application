import { type FormEvent, type SetStateAction, type Dispatch } from "react"
import { Hash, Loader2, Save, Shield, Users } from "lucide-react"
import type { Channel } from "@shared/types"
import type { ChannelDraft } from "../../types/channelInfo"

interface ChannelDetailsSectionProps {
  channel: Channel
  VisibilityIcon: typeof Hash
  draft: ChannelDraft
  currentUserIsAdmin: boolean
  isSaving: boolean
  onDraftChange: Dispatch<SetStateAction<ChannelDraft>>
  onSave: (event: FormEvent<HTMLFormElement>) => void
}

const ChannelDetailsSection = ({
  channel,
  VisibilityIcon,
  draft,
  currentUserIsAdmin,
  isSaving,
  onDraftChange,
  onSave
}: ChannelDetailsSectionProps) => (
  <section className="px-5 py-5 text-center">
    <div className="mx-auto grid size-24 place-items-center overflow-hidden rounded-full bg-[#e5f8e8] text-[#2f733c]">
      {channel.avatar?.url ? (
        <img src={channel.avatar.url} alt="" className="h-full w-full object-cover" />
      ) : (
        <VisibilityIcon size={34} />
      )}
    </div>
    <form onSubmit={onSave} className="mt-5 space-y-3 text-left">
      <label className="block">
        <span className="text-xs font-semibold text-slate-500">Name</span>
        <input
          value={draft.name}
          onChange={(event) => onDraftChange((current) => ({ ...current, name: event.target.value }))}
          disabled={!currentUserIsAdmin}
          className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-900 transition outline-none focus:border-[#96e6a1] focus:ring-2 focus:ring-[#96e6a1]/40 disabled:bg-slate-50 disabled:text-slate-600"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold text-slate-500">Description</span>
        <textarea
          value={draft.description}
          onChange={(event) => onDraftChange((current) => ({ ...current, description: event.target.value }))}
          disabled={!currentUserIsAdmin}
          rows={3}
          className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 transition outline-none focus:border-[#96e6a1] focus:ring-2 focus:ring-[#96e6a1]/40 disabled:bg-slate-50 disabled:text-slate-600"
          placeholder="No description"
        />
      </label>

      <VisibilitySegmentedControl
        visibility={draft.visibility}
        disabled={!currentUserIsAdmin}
        onChange={(visibility) => onDraftChange((current) => ({ ...current, visibility }))}
      />

      <SendPermissionControl
        sendPermissions={draft.sendPermissions}
        disabled={!currentUserIsAdmin}
        onChange={(sendPermissions) => onDraftChange((current) => ({ ...current, sendPermissions }))}
      />

      {currentUserIsAdmin && (
        <button
          type="submit"
          disabled={isSaving || !draft.name.trim()}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#96e6a1] text-sm font-semibold text-[#102315] transition hover:bg-[#86dc92] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save channel
        </button>
      )}
    </form>
  </section>
)

const VisibilitySegmentedControl = ({
  visibility,
  disabled,
  onChange
}: {
  visibility: ChannelDraft["visibility"]
  disabled: boolean
  onChange: (visibility: ChannelDraft["visibility"]) => void
}) => (
  <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-semibold text-slate-600">
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange("public")}
      className={`rounded-md px-3 py-2 transition disabled:cursor-not-allowed ${
        visibility === "public" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
      }`}
    >
      Public
    </button>
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange("private")}
      className={`rounded-md px-3 py-2 transition disabled:cursor-not-allowed ${
        visibility === "private" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
      }`}
    >
      Private
    </button>
  </div>
)

const SendPermissionControl = ({
  sendPermissions,
  disabled,
  onChange
}: {
  sendPermissions: ChannelDraft["sendPermissions"]
  disabled: boolean
  onChange: (sendPermissions: ChannelDraft["sendPermissions"]) => void
}) => (
  <div className="rounded-lg border border-slate-200 p-3">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">Who can send?</p>
        <p className="mt-0.5 text-xs text-slate-500">Channels usually keep posting to admins.</p>
      </div>
      <Shield size={18} className="shrink-0 text-green-600" />
    </div>
    <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-semibold text-slate-600">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("admins")}
        className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 transition disabled:cursor-not-allowed ${
          sendPermissions === "admins" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
        }`}
      >
        <Shield size={15} />
        Admins
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("members")}
        className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 transition disabled:cursor-not-allowed ${
          sendPermissions === "members" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
        }`}
      >
        <Users size={15} />
        Members
      </button>
    </div>
  </div>
)

export default ChannelDetailsSection
