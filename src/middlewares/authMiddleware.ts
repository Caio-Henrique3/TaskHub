import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    response.status(401).json({ message: "Token não fornecido." });

    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      response.status(403).json({ message: "Token inválido ou expirado." });

      return;
    }

    // @ts-ignore
    request.user = user;
    next();
  });
}
