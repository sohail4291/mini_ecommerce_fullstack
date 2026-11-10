import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
type JwtUser = { id: number; role: "USER" | "ADMIN" };
// Tell TypeScript that req.user exists after requireAuth
declare global { namespace Express { interface Request { user?: JwtUser } } }

// Reads "Authorization: Bearer <token>" and sets req.user
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;
    next();
  } catch { res.status(401).json({ error: "Login required" }); }
}
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ error: "Admins only" });
  next();
}
