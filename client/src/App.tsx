// Navbar + routes. Cart/Orders need login; Admin needs ADMIN role.
import { Routes, Route, Link, Navigate } from "react-router-dom";
import type {ReactNode} from "react";
import { useAuth } from "./auth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

// Guard: sends user to /login if not allowed to see the page
function Guard({ children, admin }: { children: ReactNode; admin?: boolean }) {
  const { token, role } = useAuth();
  if (!token || (admin && role !== "ADMIN")) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  const { token, role, logout } = useAuth();
  return (
    <div className="max-w-5xl mx-auto p-4">
      <nav className="flex gap-4 border-b pb-3 mb-4 font-medium">
        <Link to="/">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        {role === "ADMIN" && <Link to="/admin">Admin</Link>}
        <span className="ml-auto">
          {token ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
        </span>
      </nav>

      {/* Each Route = one URL mapped to one page component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Guard><Cart /></Guard>} />
        <Route path="/orders" element={<Guard><Orders /></Guard>} />
        <Route path="/admin" element={<Guard admin><Admin /></Guard>} />
      </Routes>
    </div>
  );
}
