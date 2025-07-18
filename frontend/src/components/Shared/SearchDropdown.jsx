import moment from "moment"
import { Link } from "react-router-dom"
import { getNewChatRoute } from "../../constants/routePaths"

const SearchDropdown = ({ friendsData = [], conversationData = [], currentUserId, onClear }) => {
  return (
    <div className="absolute left-0 right-0 top-full z-10 mt-3 rounded-md bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-gray-200 px-2 py-1">
        <h3 className="font-semibold text-gray-800">Search Results</h3>
        <button className="text-gray-500 hover:text-gray-700" onClick={onClear} aria-label="Clear search">
          &#x2715;
        </button>
      </div>

      {conversationData.length > 0 && (
        <>
          <h4 className="mb-1 mt-3 px-2 text-xs font-semibold uppercase text-gray-500">Conversations</h4>
          <ul>
            {conversationData.map((conversation) => {
              const otherUser = conversation.participants.find((p) => p._id !== currentUserId)
              const lastMessage = conversation.lastMessageData

              return (
                <Link
                  to={`conversation/${conversation._id}`}
                  key={conversation._id}
                  className="mt-1 flex items-center justify-between p-4 hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={otherUser?.profilePicture?.url || "https://via.placeholder.com/40"}
                      alt={otherUser?.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-y-1 text-sm text-gray-700">
                      <span className="font-medium">{otherUser?.username}</span>
                      {lastMessage && <span className="w-48 truncate text-xs text-gray-500">{lastMessage.content}</span>}
                    </div>
                  </div>

                  {lastMessage && (
                    <span className="whitespace-nowrap text-xs text-gray-400">
                      {moment(lastMessage.createdAt).format("h:mm a")}
                    </span>
                  )}
                </Link>
              )
            })}
          </ul>
        </>
      )}

      {friendsData.length > 0 && (
        <>
          <h4 className="mb-1 mt-4 px-2 text-xs font-semibold uppercase text-gray-500">Friends</h4>
          <ul>
            {friendsData.map((friend) => (
              <Link
                //! Besure to update the route path
                to={
                  friend?.conversation?.length > 0 ? `conversation/${friend.conversation[0]}` : getNewChatRoute(friend._id)
                }
                key={friend._id}
                className="mt-1 flex items-center space-x-2 p-4 hover:bg-gray-100"
              >
                <img
                  src={friend?.profilePicture?.url || "https://via.placeholder.com/40"}
                  alt={friend?.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex flex-col gap-y-1 text-sm text-gray-700">
                  <span className="font-medium">{friend.username}</span>
                  {friend.displayName && <span className="text-xs text-gray-500">{friend.displayName}</span>}
                </div>
              </Link>
            ))}
          </ul>
        </>
      )}

      {conversationData.length === 0 && friendsData.length === 0 && (
        <p className="mt-4 px-2 text-sm text-gray-500">No results found.</p>
      )}
    </div>
  )
}

export default SearchDropdown
