import { Application, Router } from "express";
import { UserController } from "../controllers/userController";
import { validateUser } from "../middlewares/validateUser";
import { authenticateToken } from "../middlewares/authMiddleware";

export function userRoutes(app: Application) {
  const router = Router();

  router.get("/", UserController.findAll);
  router.get("/:id", authenticateToken, UserController.findById);
  router.post("/", validateUser, UserController.register);
  router.put("/:id", authenticateToken, validateUser, UserController.update);
  router.delete("/:id", authenticateToken, UserController.delete);

  app.use("/users", router);
}
