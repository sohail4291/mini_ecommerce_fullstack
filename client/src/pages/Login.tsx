import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
export default function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = (path: "login" | "register") =>
    api<{ token: string; role: string }>("/auth/" + path, "POST", f).then((d) => { login(d.token, d.role); nav("/"); }).catch((e) => alert(e.message));
  return (<div className="flex flex-col gap-2 max-w-xs">
    <input className="border p-2" placeholder="Email" onChange={(e) => setF({ ...f, email: e.target.value })} />
    <input className="border p-2" type="password" placeholder="Password" onChange={(e) => setF({ ...f, password: e.target.value })} />
    <button className="bg-black text-white p-2" onClick={() => submit("login")}>Login</button>
    <button className="border p-2" onClick={() => submit("register")}>Register</button>
  </div>);
}
