import { Application, Router } from "express";
import { validateUser } from "../middlewares/validateUser";
import { AuthController } from "../controllers/authController";

export function authRoutes(app: Application) {
  const router = Router();

  router.post("/", validateUser, AuthController.login);

  app.use("/login", router);
}
