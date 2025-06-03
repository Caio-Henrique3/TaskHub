import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthController {
  static async login(request: Request, response: Response) {
    const { email, password } = request.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        response.status(401).json({ message: "Credenciais inválidas." });

        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        response.status(401).json({ message: "Credenciais inválidas." });

        return;
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      response.json({ token });
    } catch (error) {
      response.status(500).json({ message: "Erro ao fazer login." });
    }
  }
}
