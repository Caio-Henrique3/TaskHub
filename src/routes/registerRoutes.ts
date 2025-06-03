import { Application } from "express";
import { userRoutes } from "./userRoutes";

export function registerRoutes(app: Application) {
  app.get("/", (_, res) => {
    res.json({ message: "Welcome to TaskHub API." });
  });

  userRoutes(app);
}
