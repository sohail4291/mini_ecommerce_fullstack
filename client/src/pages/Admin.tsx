// Admin: add/edit/delete products + manage all orders
import { useEffect, useState } from "react";
import { api } from "../api";
import {type Order,type OrderStatus,type Product, rupees } from "../types";
const empty = { name: "", description: "", price: 0, stock: 0, imageUrl: "" };
const statuses: OrderStatus[] = ["PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState<typeof empty & { id?: number }>(empty);
  const load = () => { api<Product[]>("/products").then(setProducts); api<Order[]>("/orders/all").then(setOrders); };
  useEffect(load, []);
  const save = () => {   // price typed in rupees, stored in paise
    const body = { ...form, price: Math.round(+form.price * (form.id ? 1 : 100)) };
    (form.id ? api(`/products/${form.id}`, "PUT", body) : api("/products", "POST", body))
      .then(() => { setForm(empty); load(); }).catch((e) => alert(e.message));
  };
  const field = (k: keyof typeof empty, ph: string) =>
    <input className="border p-2" placeholder={ph} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />;
  return (<div className="space-y-6">
    <section><h2 className="font-bold text-lg mb-2">{form.id ? "Edit" : "Add"} product (price in rupees for new, paise when editing)</h2>
      <div className="grid grid-cols-2 gap-2">{field("name", "Name")}{field("description", "Description")}{field("price", "Price")}{field("stock", "Stock")}{field("imageUrl", "Image URL")}
        <button className="bg-black text-white p-2" onClick={save}>Save</button></div></section>
    <section><h2 className="font-bold text-lg mb-2">Products</h2>
      {products.map((p) => (<div key={p.id} className="flex gap-3 border-b py-1">
        <span className="flex-1">{p.name} · {rupees(p.price)} · stock {p.stock}</span>
        <button onClick={() => setForm(p)}>Edit</button>
        <button className="text-red-600" onClick={() => api("/products/" + p.id, "DELETE").then(load).catch((e) => alert(e.message))}>Delete</button></div>))}</section>
    <section><h2 className="font-bold text-lg mb-2">All orders</h2>
      {orders.map((o) => (<div key={o.id} className="flex gap-3 border-b py-1">
        <span className="flex-1">#{o.id} · {o.user.email} · {rupees(o.total)}</span>
        <select value={o.status} onChange={(e) => api(`/orders/${o.id}/status`, "PUT", { status: e.target.value }).then(load)}>
          {statuses.map((s) => <option key={s}>{s}</option>)}</select></div>))}</section>
  </div>);
}
