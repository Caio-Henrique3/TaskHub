import { Request, Response } from "express";
import { TaskService } from "../services/taskService";
import { Task } from "../models/taskModel";

function buildTaskFilters(query: any) {
  const filters: any = { ...query };

  if (filters.title) {
    filters.title = { $regex: filters.title, $options: "i" };
  }

  if (filters.description) {
    filters.description = { $regex: filters.description, $options: "i" };
  }

  if (filters.status) {
    filters.status = { $regex: filters.status, $options: "i" };
  }

  if (filters.recurrence) {
    filters.recurrence = { $regex: filters.recurrence, $options: "i" };
  }

  const dateFields = ["creationDate", "completionDeadline", "completionDate"];
  dateFields.forEach((field) => {
    const from = query[`${field}From`];
    const to = query[`${field}To`];
    if (from || to) {
      filters[field] = {};
      if (from) {
        if (isNaN(Date.parse(from as string))) {
          throw new Error(`Formato de data inválido: ${field}From`);
        }

        filters[field]["$gte"] = new Date(from as string);
        delete filters[`${field}From`];
      }

      if (to) {
        if (isNaN(Date.parse(to as string))) {
          throw new Error(`Formato de data inválido: ${field}To`);
        }

        filters[field]["$lte"] = new Date(to as string);
        delete filters[`${field}To`];
      }
    }
  });

  return filters;
}

export class TaskController {
  static async findAll(request: Request, response: Response) {
    try {
      response.send(await TaskService.findAll(buildTaskFilters(request.query)));
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
