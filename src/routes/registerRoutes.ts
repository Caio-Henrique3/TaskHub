import { Application } from "express";
import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { taskRoutes } from "./taskRoutes";

export function registerRoutes(app: Application) {
  app.get("/", (_, res) => {
    res.json({ message: "Welcome to TaskHub API." });
  });

  authRoutes(app);
  userRoutes(app);
  taskRoutes(app);
}
