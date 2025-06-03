import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  static async findAll(request: Request, response: Response) {
    try {
      response.json(await UserService.findAll());
    } catch (error: any) {
      response.status(500).json({ message: "Erro ao buscar usuários." });
    }
  }

  static async findById(request: Request, response: Response) {
    try {
      const user = await UserService.findById(request.params.id);
      if (!user) {
        response.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      response.json(user);
    } catch (error: any) {
      response.status(500).json({ message: "Erro ao buscar usuário." });
    }
  }

  static async register(request: Request, response: Response) {
    const { email, password } = request.body;
    try {
      const user = await UserService.register(email, password);
      response
        .status(201)
        .json({ message: "Usuário registrado com sucesso.", userId: user._id });
    } catch (error: any) {
      response.status(400).json({ message: error.message });
    }
  }
}
