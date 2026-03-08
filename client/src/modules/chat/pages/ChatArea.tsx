import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@chat/navigation/components/Sidebar"
import FriendList from "@chat/conversations/components/FriendList"
import ChatList from "@chat/conversations/components/ChatList"
import ChatCalls from "@chat/calls/components/ChatCalls"
import ChannelsList from "@chat/navigation/components/ChannelsList"
import Settings from "@chat/settings/components/Settings"

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
