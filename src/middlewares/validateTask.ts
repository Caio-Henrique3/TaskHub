import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors";

export function validateTask(req: Request, res: Response, next: NextFunction) {
  const { title, description, status } = req.body;
  if (!title || !description || !status) {
    throw new ValidationError("Título, descrição e status são obrigatórios.");
  }

  next();
}
