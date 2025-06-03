import { Application, Router } from "express";
import { UserController } from "../controllers/userController";
import { validateUser } from "../middlewares/validateUser";

export function userRoutes(app: Application) {
  const router = Router();

  router.get("/", UserController.findAll);
  router.get("/:id", UserController.findById);
  router.post("/", validateUser, UserController.register);
  router.put("/:id", validateUser, UserController.update);

  app.use("/users", router);
}
