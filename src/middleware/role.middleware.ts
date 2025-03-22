import { Request, Response, NextFunction } from "express";

export function roleMiddleware(
  requiredRole: "admin" | "employee" | "customer"
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ error: "Access denied. No user found." });
      return;
    }

    // Define role hierarchy
    const roleHierarchy: Record<string, number> = {
      admin: 3,
      employee: 2,
      customer: 1,
    };

    if (!(user.role in roleHierarchy)) {
      res.status(403).json({ error: "Access denied. Invalid role." });
      return;
    }

    // Check if user has the required role or higher
    if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
      res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
      return;
    }

    next();
  };
}
