import { createContext } from "react";

// 用户认证上下文接口定义
export interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

// 创建认证上下文
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  user: null,
  setUser: (user: any) => {},
  logout: () => {},
  token: null,
  setToken: (token: string | null) => {},
});