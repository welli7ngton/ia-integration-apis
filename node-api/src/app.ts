import express, { Application } from 'express';
import tasksRoutes from './routes/tasksRoutes';

const app: Application = express();
app.use(express.json());

// Rotas
app.use('/tasks', tasksRoutes);

// GET: home
app.get("/", (req, res) => {
    return res.json("API is running.");
  });

export default app;