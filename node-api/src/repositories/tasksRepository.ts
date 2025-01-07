import fs from "fs";

interface Task {
  id: number;
  text: string;
  summary: string | null;
  lang: string | null;
}

export class TasksRepository {
  private tasks: Task[] = [];
  private currentId: number = 1;
  private readonly filePath = "tasks.json";

  constructor() {
    this.loadTasks(); // Carrega os dados ao iniciar a classe
  }

  private saveTasks() {
    // Salva as tarefas no arquivo JSON
    fs.writeFileSync(this.filePath, JSON.stringify(this.tasks, null, 2), "utf-8");
  }

  private loadTasks() {
    // Carrega as tarefas do arquivo JSON, se existir
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf-8");
      this.tasks = JSON.parse(data);
      if (this.tasks.length > 0) {
        this.currentId = Math.max(...this.tasks.map(task => task.id)) + 1; // Atualiza o currentId
      }
    }
  }

  createTask(text: string): Task {
    const task: Task = {
      id: this.currentId++,
      text,
      summary: null,
      lang: null,
    };
    this.tasks.push(task);
    this.saveTasks(); // Salva após criar a tarefa
    return task;
  }

  updateTask(id: number, summary: string, language: string): Task | null {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex].summary = summary;
      this.tasks[taskIndex].lang = language;
      this.saveTasks(); // Salva após atualizar a tarefa
      return this.tasks[taskIndex];
    }
    return null;
  }

  getTaskById(id: number): Task | null {
    return this.tasks.find(t => t.id === id) || null;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(item => item.id !== id);
    this.saveTasks(); // Salva após excluir a tarefa
  }
}
