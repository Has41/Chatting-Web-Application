import { Link } from "react-router-dom"
import { Clock, Search } from "lucide-react"
import { CHAT_PAGE } from "@shared/constants/routePaths"

const EmptyCallLogs = () => (
  <div className="flex flex-1 items-center justify-center px-6 text-center">
    <div>
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#4f8f59] shadow-sm">
        <Clock size={24} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#18251b]">No calls yet</h3>
      <p className="mt-2 text-sm leading-6 text-[#65786a]">
        Start an audio or video call from a private chat and it will appear here.
      </p>
      <Link
        to={CHAT_PAGE}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#96e6a1] px-4 py-2 text-sm font-semibold text-[#102315] transition hover:bg-[#84dc91] focus:outline-none focus:ring-2 focus:ring-[#96e6a1] focus:ring-offset-2"
      >
        <Search size={16} />
        Find someone
      </Link>
    </div>
  </div>
)

export default EmptyCallLogs
