import { Request, Response, NextFunction } from "express";

export function validateTask(req: Request, res: Response, next: NextFunction) {
  const { title, description, status } = req.body;
  if (!title || !description || !status) {
    res.status(400).json({ message: "Título, descrição e status são obrigatórios." });

    return;
  }

  next();
}
