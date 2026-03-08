import { createContext, useState, ReactNode } from "react";
import { useQuery } from "react-query";
import axiosInstance from "@shared/utils/axiosInstance";
import { USER_PATHS } from "@shared/constants/apiPaths";
import type { User } from "@shared/types";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  refetch: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { refetch, isLoading } = useQuery({
    queryKey: USER_PATHS.GET_INFO,
    queryFn: async () => {
      const { data } = await axiosInstance.get(USER_PATHS.GET_INFO);
      return data;
    },
    onSuccess: (data: User) => {
      setUser(data);
      setIsAuthenticated(true);
      console.log(data);
    },
    onError: (error: unknown) => {
      console.error("Failed to fetch user data:", error);
      setIsAuthenticated(false);
      setUser(null);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        refetch,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
