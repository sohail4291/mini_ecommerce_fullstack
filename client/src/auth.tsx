// Login state shared across the app via React Context

import { createContext, useContext, useState } from "react";
import type {ReactNode} from "react";
type Auth = { token: string | null; role: string | null; login: (t: string, r: string) => void; logout: () => void };
const Ctx = createContext<Auth>(null!);



export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const login = (t: string, r: string) => { localStorage.setItem("token", t); localStorage.setItem("role", r); setToken(t); setRole(r); };
  const logout = () => { localStorage.clear(); setToken(null); setRole(null); };
  return <Ctx.Provider value={{ token, role, login, logout }}>{children}</Ctx.Provider>;
}
