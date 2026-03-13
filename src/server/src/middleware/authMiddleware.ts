import { JwtPayload } from "jsonwebtoken";
import type { Request, Response } from "express";
import { getUnauthorized } from "../utils/requestHelpers";
import JwtSingleton from "../utils/jwt";

export default function authMiddleware(
  req: Request & JwtPayload,
  res: Response,
  next: Function,
) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer") {
    return getUnauthorized(res, "Wrong auth schema, expected 'Bearer'");
  }
  if (!token) {
    return getUnauthorized(res, "Missing access token");
  }

  try {
    const payload = JwtSingleton.verify(token, "access");
    req["user"] = payload;
    next();
  } catch (err) {
    return getUnauthorized(res, "Invalid or expired token");
  }
}
