import React, { useState } from "react"
import { useMutation, useQuery } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import { CONVERSATION_PATHS, USER_PATHS } from "../../constants/apiPaths"
import { Link } from "react-router-dom"
import { getNewChatRoute } from "../../constants/routePaths"
import useAuth from "../../hooks/useAuth"
import truncateText from "../../utils/truncateText"
import moment from "moment"

const ChatList = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [userResults, setUserResults] = useState([])
  const [chatList, setChatList] = useState([])

  useQuery({
    queryKey: CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER,
    queryFn: async () => {
      return await axiosInstance.get(CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER)
    },
    onSuccess: ({ data }) => {
      setChatList(data?.conversations)
    },
    onError: (err) => {
      console.error(err)
    }
  })

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      return await axiosInstance.get(USER_PATHS.SEARCH_USER_DATA, {
        params: { dataToSearch: data.dataToSearch }
      })
    },
    onSuccess: ({ data }) => {
      if (data) {
        setUserResults(data.users)
      } else {
        setUserResults([])
      }
    },
    onError: (error) => {
      setUserResults([])
      console.error(error)
    }
  })

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value?.length < 3) {
      setUserResults([])
      return
    }
    mutate({ dataToSearch: value })
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setUserResults([])
  }

  return (
    <aside
      className="h-screen w-1/4 border-l border-r border-l-slate-200 border-r-slate-200 bg-gray-50 font-poppins"
      aria-label="Chat List"
    >
      <section className="p-4">
        <h2 className="mb-4 text-xl font-semibold text-black/80">Chats</h2>
        <div className="relative mx-auto mb-4 w-11/12">
          <div className="relative">
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
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search messages or users"
              className="w-full rounded bg-slate-100 p-2 pl-12 placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:ring focus:ring-blue-300"
              aria-label="Search Chats"
            />
          </div>

          {userResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-10 mt-3 rounded-md bg-white p-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-200 px-2 py-1">
                <h3 className="font-semibold text-gray-800">Search Results</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={handleClearSearch} aria-label="Clear search">
                  &#x2715;
                </button>
              </div>
              <ul>
                {userResults.map((user) => (
                  <Link
                    to={getNewChatRoute(user._id)}
                    key={user._id}
                    className="mt-1 flex items-center space-x-2 p-4 hover:bg-gray-100"
                  >
                    <img
                      src={user?.profilePicture?.url}
                      alt={user?.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex items-center">
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
                          d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                        />
                      </svg>
                      {user?.username}
                    </div>
                  </Link>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="my-8">
          <div className="relative flex h-14 w-[5rem] flex-col items-center justify-center rounded-lg bg-slate-100 shadow-sm">
            <div className="relative">
              <div className="-mt-5 mb-1 size-12 cursor-pointer rounded-full bg-green-200"></div>
              <span className="absolute bottom-1 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
            </div>
            <p className="text-sm font-semibold text-black/80">User</p>
          </div>
        </div>

        <div className="max-w-full">
          <div>
            <h1 className="mb-4 font-semibold text-black/80">Recent</h1>
          </div>
          {chatList &&
            chatList.map((list, index) => {
              return (
                <div key={index} className="my-4 w-full">
                  <ul className="space-y-4">
                    {list.participants
                      .filter((participant) => participant._id !== user._id)
                      .map((user) => (
                        <Link
                          to={`conversation/${list._id}`}
                          className="flex cursor-pointer items-center rounded p-2 transition-all duration-500 hover:bg-gray-100"
                        >
                          <img className="mr-3 h-12 w-12 rounded-full bg-slate-200" src={user?.profilePicture?.url} alt="" />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{user.username}</div>
                            <div className="truncate text-sm text-gray-600">{truncateText(list.lastMessage.content)}</div>
                          </div>
                          <div className="mb-auto flex flex-col text-xs text-gray-500">
                            <div>
                              <p>{moment(list.lastMessage.createdAt).format("h:mm a")}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </ul>
                </div>
              )
            })}
        </div>
      </section>
    </aside>
  )
}

export default ChatList
