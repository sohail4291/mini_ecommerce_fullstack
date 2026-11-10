import { useEffect, useState } from "react";
import { api } from "../api";
import {type Order, rupees } from "../types";
export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const load = () => api<Order[]>("/orders").then(setOrders);
  useEffect(() => { load(); }, []);
  return (<div>{orders.map((o) => (<div key={o.id} className="border rounded p-3 mb-3">
    <b>Order #{o.id}</b> · {o.status} · {rupees(o.total)} · {new Date(o.createdAt).toLocaleDateString()}
    <p className="text-sm text-gray-600">Ship to: {o.address}</p>
    {o.items.map((i) => <p key={i.id}>{i.product.name} × {i.quantity}</p>)}
    {o.status === "PAID" && <button className="text-red-600 mt-1" onClick={() => api(`/orders/${o.id}/cancel`, "PUT").then(load)}>Cancel order</button>}
  </div>))}</div>);
}
