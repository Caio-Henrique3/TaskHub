import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

export function authenticateToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Token não fornecido.");
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      throw new ForbiddenError("Token inválido ou expirado.");
    }

    // @ts-ignore
    request.user = user;
    next();
  });
}
