import { Request, Response, NextFunction } from "express";

export function isAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user;
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden: Admins only" });
    return;
  }
  next();
}
