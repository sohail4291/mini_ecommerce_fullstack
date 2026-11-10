import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

import {type Product, rupees } from "../types";
import { useAuth } from "../auth";
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const { token } = useAuth();
  const nav = useNavigate();
  useEffect(() => { api<Product[]>("/products?q=" + encodeURIComponent(q)).then(setProducts); }, [q]); // re-run on search
  const add = (id: number) => {
    if (!token) return nav("/login");
    api("/cart", "POST", { productId: id }).then(() => alert("Added to cart")).catch((e) => alert(e.message));
  };
  return (<div>
    <input className="border p-2 w-full mb-4" placeholder="Search products..." onChange={(e) => setQ(e.target.value)} />
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((p) => (<div key={p.id} className="border rounded p-3">
        <img src={p.imageUrl} alt={p.name} className="w-full h-36 object-cover rounded" />
        <h3 className="font-bold mt-2">{p.name}</h3><p className="text-sm text-gray-600">{p.description}</p>
        <p className="font-semibold">{rupees(p.price)}</p>
        <button disabled={p.stock === 0} className="bg-yellow-400 disabled:opacity-40 px-3 py-1 mt-2 rounded" onClick={() => add(p.id)}>
          {p.stock === 0 ? "Out of stock" : "Add to cart"}</button>
      </div>))}
    </div></div>);
}
