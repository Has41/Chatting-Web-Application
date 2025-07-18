import { createContext, useState } from "react"
import { useQuery } from "react-query"
import axiosInstance from "../utils/axiosInstance"
import { CONVERSATION_PATHS } from "../constants/apiPaths"

export const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [chatList, setChatList] = useState([])

  const { isLoading } = useQuery({
    queryKey: CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER,
    queryFn: async () => {
      return await axiosInstance.get(CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER)
    },
    onSuccess: ({ data }) => {
      setChatList(data?.conversations)
    },
    onError: (err) => {
      if (import.meta.env.PROD) return
      console.error(err)
    },
    // retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000
  })

  return <ChatContext.Provider value={{ chatList, setChatList, isLoading }}>{children}</ChatContext.Provider>
}

export default ChatProvider
