// CART module (login required)
import { Router } from "express";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";
const r = Router();
r.use(requireAuth);
r.get("/", async (req, res) => res.json(await prisma.cartItem.findMany({ where: { userId: req.user!.id }, include: { product: true }, orderBy: { id: "asc" } })));
// add 1 (or create)
r.post("/", async (req, res) => {
  const userId = req.user!.id, productId = +req.body.productId;
  res.json(await prisma.cartItem.upsert({ where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: 1 } }, create: { userId, productId, quantity: 1 } }));
});
// set exact quantity
r.put("/:productId", async (req, res) => {
  const quantity = Math.max(1, +req.body.quantity);
  await prisma.cartItem.updateMany({ where: { userId: req.user!.id, productId: +req.params.productId }, data: { quantity } });
  res.json({ ok: true });
});
r.delete("/:productId", async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user!.id, productId: +req.params.productId } });
  res.json({ ok: true });
});
export default r;
