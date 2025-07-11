import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import { connectToDatabase } from "./configs/database/connection";
import { config } from "dotenv";
import { registerRoutes } from "./routes/registerRoutes";
import { swaggerConfigs } from "./configs/swagger/swagger";

config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["https://taskhub-wkh0onrender.com", `http:/localhost:${PORT}`],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

async function startServer() {
  await connectToDatabase();

  registerRoutes(app);

  swaggerConfigs(app);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

startServer();
