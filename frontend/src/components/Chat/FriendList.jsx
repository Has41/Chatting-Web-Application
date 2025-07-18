import { useState } from "react"
import UserSearch from "./Messages/UserSearch"
import { useMutation, useQuery } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import { USER_PATHS } from "../../constants/apiPaths"

const FriendList = () => {
  const [openNotifcation, setOpenNotification] = useState(false)
  const [friendList, setFriendList] = useState([])
  const [friendRequests, setFriendRequests] = useState([])

  const toggleNotification = () => setOpenNotification((prev) => !prev)

  useQuery({
    queryKey: ["friendList&Requests"],
    queryFn: async () => {
      return await axiosInstance.get(USER_PATHS.GET_FRIENDS_AND_REQUESTS)
    },
    onSuccess: ({ data }) => {
      setFriendList(data.friends || [])
      setFriendRequests(data.friendRequests || [])
      console.log("Friend List and Requests:", data)
    },
    onError: (error) => {
      console.error("Error fetching friend list and requests:", error)
    }
  })

  const { mutate: respondFriendRequest } = useMutation({
    mutationFn: async ({ userId, response }) => {
      return await axiosInstance.post(`${USER_PATHS.RESPOND_FRIEND_REQUEST}/${userId}`, {
        response
      })
    },
    onSuccess: (data) => {
      console.log("Friend request response successful:", data)
    },
    onError: (error) => {
      console.error("Error responding to friend request:", error)
    }
  })

  return (
    <aside
      className="h-screen w-1/4 border-l border-r border-l-slate-200 border-r-slate-200 bg-gray-50 font-poppins"
      aria-label="Friend List"
    >
      <section className="p-4">
        <div className="relative mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black/80">Friends</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={toggleNotification}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          {openNotifcation && (
            <div className="absolute right-0 top-full z-10 mt-2 w-64 rounded-md bg-white p-3 shadow-lg ring-1 ring-black/5">
              {friendRequests.length > 0 ? (
                <div className="mb-6">
                  <h1 className="mb-4 font-semibold text-black/80">Friend Requests</h1>
                  <ul className="space-y-3">
                    {friendRequests.map((req) => (
                      <li
                        key={req?.from._id}
                        className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={req?.from?.profilePicture?.url || "https://via.placeholder.com/36"}
                            alt={req.username}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                          <span className="font-medium">{req.from.username}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => respondFriendRequest({ userId: req.from._id, response: "accepted" })}
                            className="rounded-full bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
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
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => respondFriendRequest({ userId: req.from._id, response: "rejected" })}
                            className="rounded-full bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
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
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="px-3 py-2 text-sm italic text-gray-500">No new friend requests</div>
              )}
            </div>
          )}
        </div>

        <UserSearch />
        <div className="my-8">
          <div className="relative flex h-14 w-[5rem] flex-col items-center justify-center rounded-lg bg-slate-100 shadow-sm">
            <div className="relative">
              <div className="-mt-5 mb-1 size-12 cursor-pointer rounded-full bg-green-200"></div>
              {/* <img className="cursor-pointer size-12 mb-1 rounded-full -mt-5" src={onlineUser} alt="User" /> */}
              <span className="absolute bottom-1 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
            </div>
            <p className="text-sm font-semibold text-black/80">User</p>
          </div>
        </div>
        <div className="max-w-full">
          <div>
            <h1 className="mb-4 font-semibold text-black/80">All Friends</h1>
          </div>
          <div className="my-4 w-full">
            <ul className="space-y-4">
              {friendList.length > 0 ? (
                friendList.map((friend) => (
                  <li
                    key={friend._id}
                    className="flex cursor-pointer items-center rounded p-2 transition-all duration-500 hover:bg-gray-100"
                  >
                    <img
                      src={friend?.profilePicture?.url || "https://via.placeholder.com/48"}
                      alt={friend.username}
                      className="mr-4 size-12 rounded-full object-cover"
                    />
                    <div className="font-semibold text-gray-800">{friend.username}</div>
                    <div className="ml-auto">
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
                          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                        />
                      </svg>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-sm italic text-gray-500">No friends found. Find friends by searching them.</li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </aside>
  )
}

export default FriendList
