import { Search, X } from "lucide-react"
import type { ChangeEvent } from "react"

interface UserSearchInputProps {
  autoFocus: boolean
  isPanel: boolean
  placeholder: string
  searchQuery: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}

const UserSearchInput = ({
  autoFocus,
  isPanel,
  placeholder,
  searchQuery,
  onChange,
  onClear
}: UserSearchInputProps) => (
  <div className="relative">
    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
      <Search className="size-5 text-slate-400" aria-hidden="true" />
    </span>
    <input
      value={searchQuery}
      onChange={onChange}
      type="text"
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`w-full rounded bg-white p-3 pl-11 text-sm text-slate-800 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-300 focus:outline-none ${
        isPanel ? "h-12" : "bg-slate-100 shadow-none"
      }`}
      aria-label="Search users"
    />
    {searchQuery && (
      <button
        type="button"
        onClick={onClear}
        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
        aria-label="Clear search"
      >
        <X className="size-4" />
      </button>
    )}
  </div>
)

export default UserSearchInput
