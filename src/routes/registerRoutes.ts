import { Application } from "express";
import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { taskRoutes } from "./taskRoutes";

export function registerRoutes(app: Application) {
  /**
   * @swagger
   * /:
   *   get:
   *     summary: Endpoint de boas-vindas
   *     tags:
   *       - General
   *     responses:
   *       200:
   *         description: Retorna uma mensagem de boas-vindas.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Welcome to TaskHub API."
   */
  app.get("/", (_, res) => {
    res.json({ message: "Welcome to TaskHub API." });
  });

  authRoutes(app);
  userRoutes(app);
  taskRoutes(app);
}
