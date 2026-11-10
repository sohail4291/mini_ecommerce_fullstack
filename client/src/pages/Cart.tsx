import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { type CartItem, rupees } from "../types";
export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const nav = useNavigate();
  const load = () => api<CartItem[]>("/cart").then(setItems);
  useEffect(() => { load(); }, []);
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const setQty = (id: number, q: number) => api("/cart/" + id, "PUT", { quantity: q }).then(load);
  const checkout = () => api("/orders/checkout", "POST", { address }).then(() => nav("/orders")).catch((e) => alert(e.message));
  return (<div>
    {items.length === 0 && <p>Your cart is empty.</p>}
    {items.map((i) => (<div key={i.id} className="flex items-center gap-3 border-b py-2">
      <span className="flex-1">{i.product.name} · {rupees(i.product.price)}</span>
      <button className="border px-2" onClick={() => setQty(i.productId, i.quantity - 1)}>-</button>{i.quantity}
      <button className="border px-2" onClick={() => setQty(i.productId, i.quantity + 1)}>+</button>
      <button className="text-red-600" onClick={() => api("/cart/" + i.productId, "DELETE").then(load)}>Remove</button>
    </div>))}
    {items.length > 0 && <>
      <p className="font-bold my-3">Total: {rupees(total)}</p>
      <textarea className="border p-2 w-full" placeholder="Delivery address" onChange={(e) => setAddress(e.target.value)} />
      <button className="bg-yellow-400 px-4 py-2 rounded mt-2" onClick={checkout}>Place order (fake payment)</button></>}
  </div>);
}
