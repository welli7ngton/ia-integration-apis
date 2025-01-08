import { Router, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { TasksRepository } from "../repositories/tasksRepository";

const router = Router();
const tasksRepository = new TasksRepository();
const baseEndpoint = process.env.PYTHON_LLM_URL
const allowedLanguages = ["en", "pt", "es"]

// POST: Cria uma tarefa e solicita resumo ao serviço Python
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, language = "en", max_chars = 200 } = req.body;
    if (!text) {
      return res.status(400).json({ error: '"Text" field is mandatory.' });
    }

    if (!allowedLanguages.includes(language)){
      return res.status(400).json({ error: 'Language not supported.' });
    }

    // Cria a "tarefa"
    const task = tasksRepository.createTask(text);

    const response = await axios.post(baseEndpoint + "/summarize", {
      text,
      language,
      max_chars
    });

    const summary = response.data.summary;

    // Atualiza a tarefa com o resumo e lingua.
    tasksRepository.updateTask(task.id, summary, language);

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});



// GET: Lista todas as tarefas
router.get("/", (req: Request, res: Response) => {
  const tasks = tasksRepository.getAllTasks();
  return res.json(tasks);
});

// GET: Lista as informações de uma task de acordo com seu id.
router.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID. should be a number." });
  }

  const task = tasksRepository.getTaskById(id);

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  return res.json(task);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID. should be a number." });
  }

  tasksRepository.deleteTask(id);

  return res.status(200).json("Task deleted.");
});

export default router;
