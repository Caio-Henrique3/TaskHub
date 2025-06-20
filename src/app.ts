import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { connectToDatabase } from "./configs/database/connection";
import { config } from "dotenv";
import { registerRoutes } from "./routes/registerRoutes";
import { swaggerConfigs } from "./configs/swagger/swagger";

config();

const app = express();
app.use(express.json());

async function startServer() {
  await connectToDatabase();

  registerRoutes(app);

  swaggerConfigs(app);

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

startServer();
