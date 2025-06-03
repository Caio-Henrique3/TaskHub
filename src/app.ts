import express from 'express';
import { connectToDatabase } from './database/connection';
import { config } from 'dotenv';

config();

const app = express();
app.use(express.json());

app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to TaskHub API.'
  });
});

async function startServer() {
  await connectToDatabase();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

startServer();