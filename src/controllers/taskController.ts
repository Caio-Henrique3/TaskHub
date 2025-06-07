import { NextFunction, Request, Response } from "express";
import { NotFoundError, ValidationError } from "../utils/errors";
import { TaskService } from "../services/taskService";
import { Task } from "../models/taskModel";
import { UserService } from "../services/userService";
import mongoose from "mongoose";

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

async function validateRelatedUser(users: string | string[]) {
  const relatedUsers = Array.isArray(users) ? users : [users];
  for (const relatedUser of relatedUsers) {
    if (!(await UserService.findById(relatedUser))) {
      throw new NotFoundError(`Usuário com id ${relatedUser} não encontrado.`);
    }
  }
}

export class TaskController {
  static async findAll(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const filters = buildTaskFilters(request.query);
      if (filters.user) {
        await validateRelatedUser(filters.user);
      }

      response.send(await TaskService.findAll(filters));
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      next(error);
    }
  }

  static async findById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const task = await TaskService.findById(request.params.id);
      if (!task) {
        throw new NotFoundError(
          `Tarefa com id ${request.params.id} não encontrada.`
        );
      }

      response.send(task);
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      next(error);
    }
  }

  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      await validateRelatedUser(request.body.user);

      response.status(201).send(await TaskService.create(request.body as Task));
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      next(error);
    }
  }

  static async update(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const task = await TaskService.findById(request.params.id);
      if (!task) {
        throw new NotFoundError(
          `Tarefa com id ${request.params.id} não encontrada.`
        );
      }

      response.send(
        await TaskService.update(request.params.id, request.body as Task)
      );
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      next(error);
    }
  }

  static async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      if (!(await TaskService.findById(request.params.id))) {
        throw new NotFoundError(
          `Tarefa com id ${request.params.id} não encontrada.`
        );
      }

      await TaskService.delete(request.params.id);
      response.status(204).send();
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      next(error);
    }
  }
}
