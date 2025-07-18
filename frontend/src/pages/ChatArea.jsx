import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Chat/Sidebar"
import FriendList from "../components/Chat/FriendList"
import ChatList from "../components/Chat/ChatList"
import ChatCalls from "../components/Chat/ChatCalls"
import ChannelsList from "../components/Chat/ChannelsList"
import Settings from "../components/Chat/Settings"

const ChatArea = () => {
  const [selectedMenu, setSelectedMenu] = useState("chatList")

  const renderMenu = () => {
    switch (selectedMenu) {
      case "chatList":
        return <ChatList />
      case "friendList":
        return <FriendList />
      case "callList":
        return <ChatCalls />
      case "channelList":
        return <ChannelsList />
      case "settings":
        return <Settings />
      default:
        return <ChatList />
    }
  }

  return (
    <main className="flex max-w-full overflow-y-hidden">
      <Sidebar setSelectedMenu={setSelectedMenu} />
      {renderMenu()}
      <Outlet />
    </main>
  )
}

export default ChatArea
