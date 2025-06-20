import { Application, Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { TaskController } from "../controllers/taskController";
import { validateTask } from "../middlewares/validateTask";

export function taskRoutes(app: Application) {
  const router = Router();

  /**
   * @swagger
   * /tasks:
   *   get:
   *     summary: Lista de tarefas com filtros e paginação
   *     tags:
   *       - Tasks
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: title
   *         schema:
   *           type: string
   *         description: Filtrar por título (parcial).
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *         description: Filtrar por status.
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
   *         description: Lista de tarefas.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Task'
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
  router.get("/", authenticateToken, TaskController.findAll);

  /**
   * @swagger
   * /tasks/{id}:
   *   get:
   *     summary: Busca uma tarefa pelo ID
   *     tags:
   *       - Tasks
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
   *       200:
   *         description: Tarefa encontrada.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
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
   *         description: Tarefa não encontrada.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Tarefa com id 683f74a680e1efe4409088e2 não encontrada.
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
  router.get("/:id", authenticateToken, TaskController.findById);

  /**
   * @swagger
   * /tasks:
   *   post:
   *     summary: Cria uma nova tarefa
   *     tags:
   *       - Tasks
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Task'
   *     responses:
   *       201:
   *         description: Tarefa criada com sucesso.
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
   *                   message: Título, descrição e status são obrigatórios.
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
  router.post("/", authenticateToken, validateTask, TaskController.create);

  /**
   * @swagger
   * /tasks/{id}:
   *   put:
   *     summary: Atualiza uma tarefa existente
   *     tags:
   *       - Tasks
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID da tarefa.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Task'
   *     responses:
   *       200:
   *         description: Tarefa atualizada com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
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
   *                   message: Título, descrição e status são obrigatórios.
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
   *         description: Dado não encontrado (tarefa ou usuário não encontrado).
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             examples:
   *               tarefaNotFound:
   *                 summary: Tarefa não encontrada.
   *                 value:
   *                   message: Tarefa com id 683f74a680e1efe4409088e2 não encontrada.
   *               usuarioNotFound:
   *                 summary: Usuário não encontrado.
   *                 value:
   *                   message: Usuário com id 683f74a680e1efe4409088e2 não encontrado.
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
  router.put("/:id", authenticateToken, validateTask, TaskController.update);

  /**
   * @swagger
   * /tasks/{id}:
   *   delete:
   *     summary: Remove uma tarefa
   *     tags:
   *       - Tasks
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
   *         description: Tarefa removida com sucesso.
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
   *         description: Tarefa não encontrada.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Tarefa com id 683f74a680e1efe4409088e2 não encontrada.
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
  router.delete("/:id", authenticateToken, TaskController.delete);

  app.use("/tasks", router);
}
