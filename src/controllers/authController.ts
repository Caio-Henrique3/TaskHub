import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";

export class AuthController {
  static async login(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedError("Credenciais inválidas.");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new UnauthorizedError("Senha inválida.");
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      response.json({ token });
    } catch (error) {
      next(error);
    }
  }
}
