import { Request, Response } from "express";
import { TaskService } from "../services/taskService";
import { Task } from "../models/taskModel";

export class TaskController {
  static async findAll(_: any, response: Response) {
    try {
      response.send(await TaskService.findAll());
    } catch (error: any) {
      response.status(500).json({ message: "Erro ao buscar tarefas." });
    }
  }

  static async findById(request: Request, response: Response) {
    try {
      const task = await TaskService.findById(request.params.id);
      if (!task) {
        response.status(404).json({ message: "Tarefa não encontrado." });

        return;
      }

      response.send(task);
    } catch (error: any) {
      response.status(500).json({ message: "Erro ao buscar tarefa." });
    }
  }

  static async create(request: Request, response: Response) {
    try {
      response.status(201).send(await TaskService.create(request.body as Task));
    } catch (error: any) {
      response.status(400).json({ message: error.message });
    }
  }

  static async update(request: Request, response: Response) {
    try {
      const user = await TaskService.findById(request.params.id);
      if (!user) {
        response.status(404).json({ message: "Task não encontrado." });

        return;
      }

      response.send(
        await TaskService.update(request.params.id, request.body as Task)
      );
    } catch (error: any) {
      response.status(400).json({ message: error.message });
    }
  }

  static async delete(request: Request, response: Response) {
    try {
      if (!(await TaskService.findById(request.params.id))) {
        response.status(404).json({ message: "Task não encontrado." });
        return;
      }

      await TaskService.delete(request.params.id);
      response.status(204).send();
    } catch (error: any) {
      response.status(500).json({ message: "Erro ao deletar task." });
    }
  }
}
