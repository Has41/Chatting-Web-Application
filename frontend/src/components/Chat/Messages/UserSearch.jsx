import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import axiosInstance from "../../../utils/axiosInstance"
import { USER_PATHS } from "../../../constants/apiPaths"
import { getNewChatRoute } from "../../../constants/routePaths"
import { Link } from "react-router-dom"

const UserSearch = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [userResults, setUserResults] = useState([])

  useQuery({
    queryKey: ["userSearch"],
    queryFn: async () => {
      return await axiosInstance.get(USER_PATHS.SEARCH_FRIENDS_USERS, {
        params: { dataToSearch: searchQuery }
      })
    },
    onSuccess: ({ data }) => {
      setUserResults(data)
      console.log(data)
    },
    onError: (error) => {
      console.error("Error fetching user search results:", error)
      setUserResults([])
    },
    enabled: searchQuery.length >= 3
  })

  const { mutate: sendFriendRequest } = useMutation({
    mutationFn: async (userId) => {
      return await axiosInstance.post(`${USER_PATHS.SEND_FRIEND_REQUEST}/${userId}`)
    },
    onSuccess: (data) => {
      console.log("Friend request sent successfully:", data)
      queryClient.invalidateQueries(["userSearch"])
      //   setUserResults((prev) => prev.map((user) => (user._id === data._id ? { ...user, isRequestSent: true } : user)))
    },
    onError: (error) => {
      console.error("Error sending friend request:", error)
    }
  })

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value.length < 3) {
      setUserResults([])
    }
  }
  const handleClearSearch = () => {
    setSearchQuery("")
    setUserResults([])
  }

  return (
    <>
      <div className="relative mx-auto mb-4 w-11/12">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m2.7-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"
            />
          </svg>
        </span>
        <input
          value={searchQuery}
          onChange={handleSearchChange}
          type="text"
          placeholder="Search friends or users"
          className="w-full rounded bg-slate-100 p-2 pl-12 placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:ring focus:ring-blue-300"
          aria-label="Search Chats"
        />
        {searchQuery.length >= 3 && userResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-10 mt-3 rounded-md bg-white p-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-2 py-1">
              <h3 className="font-semibold text-gray-800">Search Results</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={handleClearSearch} aria-label="Clear search">
                &#x2715;
              </button>
            </div>
            <ul>
              {userResults.map((u) => (
                <Link
                  to={getNewChatRoute(u._id)}
                  key={u._id}
                  className="mt-1 flex items-center justify-between space-x-2 p-4 hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={u?.profilePicture?.url || "https://via.placeholder.com/40"}
                      alt={u?.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{u.username}</span>
                    </div>
                  </div>

                  {u.isFriend ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                    </span>
                  ) : u.isRequestSent ? (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        sendFriendRequest(u._id)
                        console.log("Send friend request to:", u.username)
                      }}
                      className="rounded-full bg-green-400 px-2 py-1 text-xs text-white hover:bg-green-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                        />
                      </svg>
                    </button>
                  )}
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default UserSearch
