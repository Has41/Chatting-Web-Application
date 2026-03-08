import { createContext, useState, ReactNode } from "react";
import { useQuery } from "react-query";
import axiosInstance from "@shared/utils/axiosInstance";
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths";
import type { Conversation } from "@shared/types";

interface ChatContextType {
  chatList: Conversation[];
  setChatList: (chatList: Conversation[]) => void;
  isLoading: boolean;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined,
);

interface ChatProviderProps {
  children: ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chatList, setChatList] = useState<Conversation[]>([]);

  const { isLoading } = useQuery({
    queryKey: CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER,
    queryFn: async () => {
      return await axiosInstance.get(
        CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER,
      );
    },
    onSuccess: ({ data }: { data: { conversations: Conversation[] } }) => {
      setChatList(data?.conversations);
    },
    onError: (err: unknown) => {
      if (import.meta.env.PROD) return;
      console.error(err);
    },
  });

  return (
    <ChatContext.Provider value={{ chatList, setChatList, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
