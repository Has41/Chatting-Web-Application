import { useMemo, useState } from "react"
import { profileInfoData } from "../../utils/dynamicData"
import { useMutation } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import { CONVERSATION_PATHS } from "../../constants/apiPaths"
import useChatList from "../../hooks/useChatList"

const ProfileSidebar = ({ isOpen, onClose, data, setData }) => {
  const { chatList, setChatList } = useChatList()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [groupName, setGroupName] = useState(data?.groupName || "")
  const [groupInfo, setGroupInfo] = useState(data?.groupInfo || "")
  const [searchQuery, setSearchQuery] = useState("")

  const { mutate: handleSave, isLoading } = useMutation({
    mutationFn: async ({ groupName, groupInfo }) => {
      return await axiosInstance.put(`${CONVERSATION_PATHS.EDIT_GROUP_INFO}/${data?._id}`, {
        groupName,
        groupInfo
      })
    },
    onMutate: async (newData) => {
      const previousChatList = chatList

      setData((prev) => ({
        ...prev,
        ...(newData.groupName !== undefined && { groupName: newData.groupName }),
        ...(newData.groupInfo !== undefined && { groupInfo: newData.groupInfo })
      }))

      if (newData.groupName !== undefined) {
        setChatList((prev) => prev.map((chat) => (chat._id === data._id ? { ...chat, groupName: newData.groupName } : chat)))
      }

      return { previousChatList }
    },

    onSuccess: () => {
      setIsEditingInfo(false)
      setIsEditing(false)
      console.log("Edited successfully!")
    },
    onError: (error) => {
      setIsEditing(false)
      setIsEditingInfo(false)
      console.error(error)
    }
  })

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredParticipants = useMemo(() => {
    if (!searchQuery) return data?.participants || []
    return data?.participants.filter((p) => p.username.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, data?.participants])

  const ownerMatch = searchQuery && data.groupOwner.username.toLowerCase().includes(searchQuery.toLowerCase())

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-opacity-40"
          onClick={() => {
            setIsEditing(false)
            setIsEditingInfo(false)
            onClose()
          }}
        ></div>
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{data?.conversationType ? "Group Info" : "Profile Info"}</h3>
          <button
            onClick={() => {
              setIsEditingInfo(false)
              setIsEditing(false)
              onClose()
            }}
            className="text-xl text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4 text-center">
          {data?.conversationType ? (
            <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-gray-300 text-xl font-semibold text-white">
              {data?.groupName?.charAt(0).toUpperCase()}
            </div>
          ) : (
            <img src={data?.profilePicture?.url} alt="Profile" className="mx-auto h-24 w-24 rounded-full object-cover" />
          )}
          <div className="mt-4 flex items-center justify-center gap-2">
            {isEditing && data?.conversationType ? (
              <>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="border-b border-gray-400 text-center text-lg font-bold outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handleSave({ groupName })}
                  className="flex size-7 items-center justify-center rounded-full bg-custom-green text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <h4 className="text-lg font-bold">{data?.username || data?.groupName || "Unknown"}</h4>
                {data?.conversationType && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex size-7 items-center justify-center rounded-full bg-custom-green text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
          <div className="mt-2 flex items-center justify-center gap-x-2 text-sm text-gray-600">
            {isEditingInfo ? (
              <>
                <input
                  type="text"
                  value={groupInfo}
                  onChange={(e) => setGroupInfo(e.target.value)}
                  className="border-b border-gray-400 text-center text-sm outline-none"
                  autoFocus
                />

                <button
                  onClick={() => handleSave({ groupInfo })}
                  className="flex size-7 items-center justify-center rounded-full bg-custom-green text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-4 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <p>{data?.groupInfo || "No bio available"}</p>
                {data?.conversationType && (
                  <button
                    onClick={() => setIsEditingInfo(true)}
                    className="flex size-7 items-center justify-center rounded-full bg-custom-green text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 w-full px-6">
          <div className="flex justify-around">
            {profileInfoData.map((data, index) => (
              <div key={index} className="flex cursor-pointer flex-col items-center">
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-white shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-5 text-custom-text"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={data.iconPath} />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">{data.name}</span>
              </div>
            ))}
          </div>
        </div>
        {data?.conversationType && (
          <div className="mt-6 max-h-[35%] overflow-y-auto border-t px-4 pt-4">
            <h4 className="text-md mb-2 font-semibold">Members ({(data?.participants?.length || 0) + 1})</h4>

            <div className="relative mx-auto mb-4 w-full">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-400"
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
                placeholder="Search members"
                className="w-full rounded bg-slate-100 p-2 pl-12 placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            {searchQuery ? (
              <>
                {ownerMatch && (
                  <div className="flex items-center justify-between rounded p-2 hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={data.groupOwner.profilePicture?.url || "https://via.placeholder.com/40"}
                        alt={data.groupOwner.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium">{data.groupOwner.username}</span>
                    </div>
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-600">Owner</span>
                  </div>
                )}

                {filteredParticipants.length > 0
                  ? filteredParticipants.map((member) => (
                      <div key={member._id} className="flex items-center justify-between rounded p-2 hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={member?.profilePicture?.url || "https://via.placeholder.com/40"}
                            alt={member.username}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium">{member.username}</span>
                        </div>
                      </div>
                    ))
                  : !ownerMatch && <p className="text-center text-sm text-gray-500">No members found</p>}
              </>
            ) : (
              <>
                {/* Owner Section */}
                {data.groupOwner && (
                  <div className="mb-3">
                    <h5 className="mb-1 text-xs uppercase text-gray-500">Owner</h5>
                    <div className="flex items-center justify-between rounded p-2 hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={data.groupOwner.profilePicture?.url || "https://via.placeholder.com/40"}
                          alt={data.groupOwner.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{data.groupOwner.username}</span>
                      </div>
                      <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-600">Owner</span>
                    </div>
                  </div>
                )}

                <div>
                  <h5 className="mb-1 text-xs uppercase text-gray-500">Participants</h5>
                  <ul className="space-y-2">
                    {filteredParticipants.map((member) => (
                      <li key={member._id} className="flex items-center justify-between rounded p-2 hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={member?.profilePicture?.url || "https://via.placeholder.com/40"}
                            alt={member.username}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium">{member.username}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ProfileSidebar
