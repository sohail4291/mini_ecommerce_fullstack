// PRODUCT + ADMIN module: public read, admin write
import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, requireAdmin } from "../middleware/auth";
const r = Router();
r.get("/", async (req, res) => {
  const q = String(req.query.q || "");
  res.json(await prisma.product.findMany({ where: { name: { contains: q, mode: "insensitive" } }, orderBy: { id: "asc" } }));
});
r.get("/:id", async (req, res) => {
  const p = await prisma.product.findUnique({ where: { id: +req.params.id } });
  p ? res.json(p) : res.status(404).json({ error: "Not found" });
});
// pick only allowed fields (never trust req.body blindly)
const clean = (b: any) => ({ name: String(b.name), description: String(b.description || ""), price: Math.round(+b.price), stock: Math.round(+b.stock), imageUrl: String(b.imageUrl || "") });
r.post("/", requireAuth, requireAdmin, async (req, res) => res.json(await prisma.product.create({ data: clean(req.body) })));
r.put("/:id", requireAuth, requireAdmin, async (req, res) => res.json(await prisma.product.update({ where: { id: +req.params.id }, data: clean(req.body) })));
r.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try { await prisma.product.delete({ where: { id: +req.params.id } }); res.json({ ok: true }); }
  catch { res.status(400).json({ error: "Cannot delete: product is in carts or orders. Set stock to 0 instead." }); }
});
export default r;
