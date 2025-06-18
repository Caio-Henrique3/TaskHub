import { Request } from "express";
import jwt from "jsonwebtoken";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "bearerAuth") {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Token não fornecido");
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      return decoded;
    } catch (err) {
      throw new Error("Token inválido");
    }
  }
  throw new Error("Método de autenticação não suportado");
}