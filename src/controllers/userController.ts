import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {

  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await UserService.register(email, password);
      res.status(201).json({ message: "Usuário registrado com sucesso.", userId: user._id });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }

  }
}