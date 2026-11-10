// ORDER + INVENTORY + PAYMENT(fake). Multi-step work uses ONE transaction.
import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, requireAdmin } from "../middleware/auth";
const r = Router();
r.use(requireAuth);
const include = { items: { include: { product: true } }, user: { select: { email: true } } };

r.post("/checkout", async (req, res) => {
  const userId = req.user!.id;
  const address = String(req.body.address || "").trim();
  if (!address) return res.status(400).json({ error: "Address required" });
  try {
    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cartItem.findMany({ where: { userId }, include: { product: true } });
      if (!cart.length) throw new Error("Cart is empty");
      for (const c of cart) {                       // INVENTORY
        if (c.product.stock < c.quantity) throw new Error(`Not enough stock: ${c.product.name}`);
        await tx.product.update({ where: { id: c.productId }, data: { stock: { decrement: c.quantity } } });
      }
      const total = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);
      // PAYMENT: fake. Replace with Razorpay/Stripe call here.
      const o = await tx.order.create({ data: { userId, total, address,
        items: { create: cart.map((c) => ({ productId: c.productId, quantity: c.quantity, price: c.product.price })) } } });
      await tx.cartItem.deleteMany({ where: { userId } });
      return o;
    });
    res.json(order);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});
// my orders
r.get("/", async (req, res) => res.json(await prisma.order.findMany({ where: { userId: req.user!.id }, include, orderBy: { id: "desc" } })));
// cancel my order (only while PAID) and put stock back
r.put("/:id/cancel", async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      const o = await tx.order.findFirst({ where: { id: +req.params.id, userId: req.user!.id }, include: { items: true } });
      if (!o || o.status !== "PAID") throw new Error("Order cannot be cancelled");
      for (const i of o.items) await tx.product.update({ where: { id: i.productId }, data: { stock: { increment: i.quantity } } });
      await tx.order.update({ where: { id: o.id }, data: { status: "CANCELLED" } });
    });
    res.json({ ok: true });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});
// ADMIN: all orders + change status
r.get("/all", requireAdmin, async (_req, res) => res.json(await prisma.order.findMany({ include, orderBy: { id: "desc" } })));
r.put("/:id/status", requireAdmin, async (req, res) => res.json(await prisma.order.update({ where: { id: +req.params.id }, data: { status: req.body.status } })));
export default r;
