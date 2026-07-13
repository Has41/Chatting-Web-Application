import { Search } from "lucide-react"

const GroupModalSearch = ({
  searchQuery,
  onSearchQueryChange
}: {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
}) => (
  <div className="relative mb-4 w-11/12">
    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
      <Search className="h-5 w-5 text-gray-400" />
    </span>
    <input
      value={searchQuery}
      onChange={(event) => onSearchQueryChange(event.target.value)}
      type="text"
      placeholder="Search friends or conversations"
      className="w-full rounded bg-slate-100 p-2 pl-12 placeholder:text-sm placeholder:text-slate-400 focus:ring focus:ring-blue-300 focus:outline-none"
    />
  </div>
)

export default GroupModalSearch
