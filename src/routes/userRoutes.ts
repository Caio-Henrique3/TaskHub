import { Application, Router } from "express";
import { UserController } from "../controllers/userController";
import { validateUser } from "../middlewares/validateUser";
import { authenticateToken } from "../middlewares/authMiddleware";

export function userRoutes(app: Application) {
  const router = Router();

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Lista de usuários com filtros e paginação
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: email
   *         schema:
   *           type: string
   *         description: Filtrar por email (parcial).
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Página para paginação.
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Limite de itens por página.
   *     responses:
   *       200:
   *         description: Lista de usuários.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   *                 page:
   *                   type: integer
   *                 limit:
   *                   type: integer
   *                 total:
   *                   type: integer
   *                 totalPages:
   *                   type: integer
   *       401:
   *         description: "Não realizada a autenticação para obtenção de token."
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Token não fornecido.
   *       403:
   *         description: "Token inválido ou expirado, necessário realizar login novamente."
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Token inválido ou expirado.
   *       500:
   *         description: Erro interno do servidor.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Erro interno do servidor.
   */
  router.get("/", UserController.findAll);

  /**
   * @swagger
   * /users/{id}:
   *  get:
   *    summary: Busca de um usuário pelo ID
   *    tags:
   *      - Users
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: string
   *        description: Id do usuário.
   *    responses:
   *      200:
   *        description: Usuário encontrado.
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/User'
   *      400:
   *        description: "Id informado contém formato inválido."
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  example: Id 683f74a680e1efe4409088e254sdsad é inválido.
   *      401:
   *        description: "Não realizada a autenticação para obtenção de token."
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  example: Token não fornecido.
   *      403:
   *        description: "Token inválido ou expirado, necessário realizar login novamente."
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  example: Token inválido ou expirado.
   *      404:
   *        description: Usuário não encontrado.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  example: Usuário com id 683f74a680e1efe4409088e2 não encontrado.
   *      500:
   *        description: Erro interno do servidor.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  example: Erro interno do servidor.
   */
  router.get("/:id", authenticateToken, UserController.findById);

  /**
   * @swagger
   * /users:
   *  post:
   *    summary: Cria um novo usuário
   *    tags:
   *      - Users
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/User'
   *    responses:
   *      201:
   *        description: Usuário criado com sucesso.
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/User'
   *      400:
   *        description: "Requisição inválida."
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  example: Email e senha são obrigatórios.
   *      500:
   *        description: Erro interno do servidor.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  example: Erro interno do servidor.
   */
  router.post("/", validateUser, UserController.register);

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Atualiza um usuário existente
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do usuário.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: Usuário atualizado com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: "Requisição inválida (ID ou dados inválidos)."
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             examples:
   *               idInvalido:
   *                 summary: Id informado contém formato inválido.
   *                 value:
   *                   message: Id 683f74a680e1efe4409088e254sdsad é inválido.
   *               dadosInvalidos:
   *                 summary: Dados inválidos
   *                 value:
   *                   message: Email e senha são obrigatórios.
   *       401:
   *         description: "Não realizada a autenticação para obtenção de token."
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Token não fornecido.
   *       403:
   *         description: "Token inválido ou expirado, necessário realizar login novamente."
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Token inválido ou expirado.
   *       404:
   *         description: Usuário não encontrado.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuário com id 683f74a680e1efe4409088e2 não encontrado.
   *       500:
   *         description: Erro interno do servidor.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Erro interno do servidor.
   */
  router.put("/:id", authenticateToken, validateUser, UserController.update);

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Remove um usuário
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID da tarefa.
   *     responses:
   *       204:
   *         description: Usuário removido com sucesso.
   *       400:
   *         description: "Id informado contém formato inválido."
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Id 683f74a680e1efe4409088e254sdsad é inválido.
   *       401:
   *         description: "Não realizada a autenticação para obtenção de token."
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Token não fornecido.
   *       403:
   *         description: "Token inválido ou expirado, necessário realizar login novamente."
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Token inválido ou expirado.
   *       404:
   *         description: Usuário não encontrado.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuário com id 683f74a680e1efe4409088e2 não encontrado.
   *       500:
   *         description: Erro interno do servidor.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Erro interno do servidor.
   */
  router.delete("/:id", authenticateToken, UserController.delete);

  app.use("/users", router);
}
