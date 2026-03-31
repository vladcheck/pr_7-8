import { NextFunction, Request, Response } from "express";
import { UserRole } from "../entities/User";
import { JwtPayload } from "jsonwebtoken";

export default function roleMiddleware(allowedRoles: UserRole[]) {
  return (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user || !allowedRoles.includes(req.user["role"])) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }
    next();
    return;
  };
}
