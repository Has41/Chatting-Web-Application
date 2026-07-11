import { useEffect, useState, type ChangeEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@shared/api/api-client"
import { USER_PATHS } from "@shared/constants/apiPaths"
import { getNewChatRoute } from "@shared/constants/routePaths"
import { Link } from "react-router-dom"
import { Check, Clock, MessageCircle, Search, UserPlus, UserRound, X } from "lucide-react"
import type { User } from "@shared/types"

interface UserSearchResult extends User {
  isFriend?: boolean
  isRequestSent?: boolean
  hasIncomingRequest?: boolean
}

interface UserSearchProps {
  variant?: "dropdown" | "panel"
  placeholder?: string
  autoFocus?: boolean
}

const UserSearch = ({
  variant = "dropdown",
  placeholder = "Search people to start a chat",
  autoFocus = false
}: UserSearchProps) => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const isPanel = variant === "panel"

  const { data: searchData, error: searchError, isFetching } = useQuery({
    queryKey: ["userSearch", searchQuery],
    queryFn: async () => {
      const response = await axiosInstance.get(USER_PATHS.SEARCH_FRIENDS_USERS, {
        params: { dataToSearch: searchQuery.trim() }
      })
      return response.data as UserSearchResult[]
    },
    enabled: searchQuery.trim().length >= 3
  })

  const userResults = searchData ?? []

  useEffect(() => {
    if (!searchError) return
    console.error("Error fetching user search results:", searchError)
  }, [searchError])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const { mutate: sendFriendRequest, isPending: isSendingRequest } = useMutation({
    mutationFn: async (userId: string) => {
      return axiosInstance.post(`${USER_PATHS.SEND_FRIEND_REQUEST}/${userId}`)
    },
    onSuccess: (_data, userId) => {
      queryClient.setQueriesData<UserSearchResult[]>({ queryKey: ["userSearch"] }, (results) =>
        results?.map((result) => (result._id === userId ? { ...result, isRequestSent: true } : result))
      )
      queryClient.invalidateQueries({ queryKey: ["userSearch"] })
      queryClient.invalidateQueries({ queryKey: ["friendList&Requests"] })
    },
    onError: (error) => {
      console.error("Error sending friend request:", error)
    }
  })

  const shouldShowResults = searchQuery.trim().length >= 3
  const resultsContent = (
    <div className={isPanel ? "mt-4" : "absolute top-full right-0 left-0 z-10 mt-3 rounded-md bg-white p-3 shadow-lg"}>
      <div className="flex items-center justify-between border-b border-slate-200 px-2 py-2">
        <h3 className="text-sm font-semibold text-slate-800">People</h3>
        {!isPanel && (
          <button type="button" className="text-slate-500 hover:text-slate-700" onClick={handleClearSearch} aria-label="Clear search">
            <X className="size-4" />
          </button>
        )}
      </div>

      {isFetching ? (
        <div className="space-y-2 px-2 py-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex animate-pulse items-center gap-3 rounded-md p-2">
              <div className="size-10 rounded-full bg-slate-200" />
              <div className="min-w-0 flex-1">
                <div className="mb-2 h-3 w-2/3 rounded bg-slate-200" />
                <div className="h-2 w-1/3 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : userResults.length > 0 ? (
        <ul className={isPanel ? "max-h-72 overflow-y-auto py-2" : "max-h-80 overflow-y-auto py-2"}>
          {userResults.map((result) => {
            const canSendRequest = !result.isFriend && !result.isRequestSent && !result.hasIncomingRequest

            return (
              <li key={result._id} className="flex items-center gap-2 rounded-md p-2 transition hover:bg-slate-100">
                <Link
                  to={getNewChatRoute(result._id)}
                  onClick={handleClearSearch}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  {result.profilePicture?.url ? (
                    <img
                      src={result.profilePicture.url}
                      alt={result.displayName || result.username}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <UserRound className="size-5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {result.displayName || result.username}
                      </p>
                      {result.isFriend && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-700">
                          Friend
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-slate-500">@{result.username}</p>
                  </div>

                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-white">
                    <MessageCircle className="size-4" />
                  </span>
                </Link>

                {canSendRequest ? (
                  <button
                    type="button"
                    onClick={() => sendFriendRequest(result._id)}
                    disabled={isSendingRequest}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    title="Send friend request"
                    aria-label={`Send friend request to ${result.username}`}
                  >
                    <UserPlus className="size-4" />
                  </button>
                ) : result.isRequestSent ? (
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                    title="Friend request sent"
                    aria-label="Friend request sent"
                  >
                    <Clock className="size-4" />
                  </span>
                ) : result.hasIncomingRequest ? (
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700"
                    title="They sent you a request"
                    aria-label="Incoming friend request"
                  >
                    <Clock className="size-4" />
                  </span>
                ) : (
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                    title="Already friends"
                    aria-label="Already friends"
                  >
                    <Check className="size-4" />
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="px-3 py-6 text-center text-sm text-slate-500">No matching users found</div>
      )}
    </div>
  )

  return (
    <div className={`relative ${isPanel ? "mx-auto w-full max-w-xl" : "mx-auto mb-4 w-11/12"}`}>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Search className="size-5 text-slate-400" aria-hidden="true" />
        </span>
        <input
          value={searchQuery}
          onChange={handleSearchChange}
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
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {shouldShowResults ? (
        resultsContent
      ) : isPanel ? (
        <p className="mt-3 text-center text-xs text-slate-500">Type at least 3 characters to find someone.</p>
      ) : null}
    </div>
  )
}

export default UserSearch
