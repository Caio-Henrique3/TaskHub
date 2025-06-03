import { Application } from "express";
import { userRoutes } from "./userRoutes";
import { authRoutes } from "./authRoutes";

export function registerRoutes(app: Application) {
  app.get("/", (_, res) => {
    res.json({ message: "Welcome to TaskHub API." });
  });

  authRoutes(app);
  userRoutes(app);
}
