import { Request, Response, NextFunction } from "express";

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email e senha são obrigatórios." });

    return;
  }

  next();
}