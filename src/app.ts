import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { connectToDatabase } from "./database/connection";
import { config } from "dotenv";
import { registerRoutes } from "./routes/registerRoutes";

config();

const app = express();
app.use(express.json());

async function startServer() {
  await connectToDatabase();

  registerRoutes(app);

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

startServer();
