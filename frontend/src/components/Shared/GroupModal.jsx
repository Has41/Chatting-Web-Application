import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useMutation, useQuery } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import { CONVERSATION_PATHS, USER_PATHS } from "../../constants/apiPaths"

const GroupModal = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFriends, setFilteredFriends] = useState([])
  const [filteredConversations, setFilteredConversations] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  const { data } = useQuery({
    queryKey: ["userFriendsAndConversations"],
    queryFn: async () => {
      const res = await axiosInstance.get(USER_PATHS.GET_FRIENDS_AND_CONVERSATIONS)
      return res.data
    },
    onSuccess: ({ friends, conversations }) => {
      console.log("Fetched friends and conversations:", friends, conversations)
      setFilteredFriends(friends)
      setFilteredConversations(conversations)
    },
    onError: (error) => {
      console.error("Error fetching data:", error)
    }
  })

  const { mutate: createGroup } = useMutation({
    mutationFn: async ({ participants }) => {
      return await axiosInstance.post(CONVERSATION_PATHS.CREATE_GROUP, {
        participants
      })
    },
    onSuccess: (data) => {
      console.log("Group created successfully:", data)
      onClose()
    },
    onError: (error) => {
      console.error("Error creating group:", error)
    }
  })

  useEffect(() => {
    if (!data) return

    const query = searchQuery.toLowerCase()

    setFilteredFriends(data.friends.filter((f) => f.username.toLowerCase().includes(query)))

    setFilteredConversations(
      data.conversations.filter((c) => {
        const other = c.participants.find((p) => p._id !== data._id)
        return other?.username?.toLowerCase().includes(query)
      })
    )
  }, [searchQuery, data])

  const handleToggle = (userId) => {
    setSelectedIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleCreateGroup = () => {
    if (selectedIds.length < 2) return
    createGroup({ participants: selectedIds })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins shadow-lg backdrop-blur-sm">
      <div className="z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Create Group</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="relative mb-4 w-11/12">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m2.7-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"
              />
            </svg>
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search friends or conversations"
            className="w-full rounded bg-slate-100 p-2 pl-12 placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {filteredFriends.length > 0 && (
            <>
              <h4 className="px-1 text-xs font-bold text-gray-500">Friends</h4>
              {filteredFriends.map((friend) => (
                <div key={friend._id} className="flex items-center justify-between rounded px-3 py-2 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <img
                      src={friend?.profilePicture?.url || "https://via.placeholder.com/40"}
                      alt={friend.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-800">{friend.username}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(friend._id)}
                    onChange={() => handleToggle(friend._id)}
                    className="form-checkbox accent-custom-text h-4 w-4 cursor-pointer"
                  />
                </div>
              ))}
            </>
          )}

          {filteredConversations.length > 0 && (
            <>
              <h4 className="mt-4 px-1 text-xs font-bold text-gray-500">From Conversations</h4>
              {filteredConversations
                .filter((con) => con.isFriend === false)
                .map((conv) => {
                  const other = conv.participants.find((p) => p._id !== data._id)
                  return (
                    <div key={other._id} className="flex items-center justify-between rounded px-3 py-2 hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <img
                          src={other?.profilePicture?.url || "https://via.placeholder.com/40"}
                          alt={other.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-800">{other.username}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(other._id)}
                        onChange={() => handleToggle(other._id)}
                        className="h-4 w-4 text-custom-text accent-green-500 focus:ring-green-500"
                      />
                    </div>
                  )
                })}
            </>
          )}
        </div>

        <button
          onClick={handleCreateGroup}
          disabled={selectedIds.length < 2}
          className="mt-4 w-full rounded bg-custom-green px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create Group with {selectedIds.length} {selectedIds.length === 1 ? "member" : "members"}
        </button>
      </div>
    </div>,
    document.body
  )
}

export default GroupModal
