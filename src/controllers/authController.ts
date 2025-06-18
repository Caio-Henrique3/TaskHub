import { Route, Post, Body, Response, SuccessResponse, Tags } from 'tsoa';
import { UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface ErrorResponse {
  message: string;
}

@Route('login')
@Tags('Auth')
export class AuthController {
  /**
   * Realiza login do usuário
   * @param requestBody Credenciais do usuário
   */
  @Post()
  @SuccessResponse('200', 'Login realizado com sucesso')
  @Response<ErrorResponse>('401', 'Credenciais inválidas')
  public async login(@Body() requestBody: LoginRequest): Promise<LoginResponse> {
    const { email, password } = requestBody;
    
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw {
        status: 401,
        message: "Credenciais inválidas."
      };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw {
        status: 401,
        message: "Senha inválidas."
      };
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return { token };
  }
}