import { createContext } from "react";

export const UserContext = createContext({
  balance: 0,
  setBalance: (balance: number) => {},
  saveUserData: () => {},
});