import { Application, Router } from "express";
import { UserController } from "../controllers/userController";
import { validateUser } from "../middlewares/validateUser";

export function userRoutes(app: Application) {
  const router = Router();

  router.post("/", validateUser, UserController.register);

  app.use("/users", router);
}
