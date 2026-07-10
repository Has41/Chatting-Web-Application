import { useEffect, useMemo, useState } from "react"
import { io, type Socket } from "socket.io-client"
import useAuth from "@auth/hooks/useAuth"
import type { User } from "@shared/types"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"

const useFriendPresence = (friends: User[] = []) => {
  const { user } = useAuth()
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set())
  const friendIds = useMemo(() => friends.map((friend) => friend._id), [friends])

  useEffect(() => {
    if (!user?._id || friendIds.length === 0) {
      setOnlineUserIds(new Set())
      return
    }

    const socket: Socket = io(SOCKET_URL, {
      query: { userId: user._id },
      transports: ["websocket"],
      autoConnect: true
    })

    const requestOnlineUsers = () => {
      socket.emit("checkOnlineUsers", friendIds)
    }

    const handleOnlineUsersResponse = ({ onlineUserIds }: { onlineUserIds?: string[] }) => {
      setOnlineUserIds(new Set(onlineUserIds ?? []))
    }

    const handleUserOnline = ({ userId }: { userId?: string }) => {
      if (!userId || !friendIds.includes(userId)) return
      setOnlineUserIds((prev) => new Set(prev).add(userId))
    }

    const handleUserOffline = ({ userId }: { userId?: string }) => {
      if (!userId) return
      setOnlineUserIds((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }

    socket.on("connect", requestOnlineUsers)
    socket.on("onlineUsersResponse", handleOnlineUsersResponse)
    socket.on("userOnline", handleUserOnline)
    socket.on("userOffline", handleUserOffline)

    return () => {
      socket.off("connect", requestOnlineUsers)
      socket.off("onlineUsersResponse", handleOnlineUsersResponse)
      socket.off("userOnline", handleUserOnline)
      socket.off("userOffline", handleUserOffline)
      socket.disconnect()
    }
  }, [friendIds, user?._id])

  const onlineFriends = useMemo(
    () => friends.filter((friend) => onlineUserIds.has(friend._id)),
    [friends, onlineUserIds]
  )

  return {
    onlineFriends,
    onlineUserIds
  }
}

export default useFriendPresence
