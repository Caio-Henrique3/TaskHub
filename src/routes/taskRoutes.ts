import { Application, Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { TaskController } from "../controllers/taskController";
import { validateTask } from "../middlewares/validateTask";


export function taskRoutes(app: Application) {
  const router = Router();

  router.get("/", authenticateToken, TaskController.findAll);
  router.get("/:id", authenticateToken, TaskController.findById);
  router.post("/", authenticateToken, validateTask, TaskController.create);
  router.put("/:id", authenticateToken, validateTask, TaskController.update);
  router.delete("/:id", authenticateToken, TaskController.delete);

  app.use("/tasks", router);
}
