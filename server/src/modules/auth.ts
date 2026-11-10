// AUTH + USER module
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
const r = Router();
const sign = (u: { id: number; role: string }) => jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });

r.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) return res.status(400).json({ error: "Email and 6+ char password required" });
  if (await prisma.user.findUnique({ where: { email } })) return res.status(400).json({ error: "Email already used" });
  const user = await prisma.user.create({ data: { email, password: await bcrypt.hash(password, 10) } });
  res.json({ token: sign(user), role: user.role });
});
r.post("/login", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ error: "Wrong email or password" });
  res.json({ token: sign(user), role: user.role });
});
export default r;
