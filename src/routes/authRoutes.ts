import { Application, Router } from "express";
import { validateUser } from "../middlewares/validateUser";
import { AuthController } from "../controllers/authController";

export function authRoutes(app: Application) {
  const router = Router();

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Realiza o login do usuário
   *     tags:
   *       - Auth
   *     description: Endpoint para autenticar um usuário e retornar um token JWT.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: usuario@email.com
   *               password:
   *                 type: string
   *                 example: senha123
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: Token JWT de autenticação
   *       400:
   *         description: "Dados inválidos (ex: email ou senha não enviados)"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Email e senha são obrigatórios.
   *       401:
   *         description: "Credenciais inválidas (usuário não encontrado ou senha incorreta)"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Credenciais inválidas.
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Erro interno do servidor.
   */
  router.post("/", validateUser, AuthController.login);

  app.use("/login", router);
}
