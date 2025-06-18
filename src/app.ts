import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { connectToDatabase } from "./configs/database/connection";
import { config } from "dotenv";
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./configs/swagger/swagger.json";

config();

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function startServer() {
  await connectToDatabase();

  RegisterRoutes(app);

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`Swagger in http://localhost:${PORT}/api-docs`);
  });
}

startServer();
