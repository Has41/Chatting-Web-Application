import { Search } from "lucide-react"
import type { ChangeEvent } from "react"

const MemberSearchInput = ({
  searchQuery,
  onSearchChange
}: {
  searchQuery: string
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className="relative mx-auto mb-4 w-full">
    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
      <Search className="h-5 w-5 text-gray-400" />
    </span>
    <input
      value={searchQuery}
      onChange={onSearchChange}
      type="text"
      placeholder="Search members"
      className="w-full rounded bg-slate-100 p-2 pl-12 placeholder:text-sm placeholder:text-slate-400 focus:ring focus:ring-blue-300 focus:outline-none"
    />
  </div>
)

export default MemberSearchInput
