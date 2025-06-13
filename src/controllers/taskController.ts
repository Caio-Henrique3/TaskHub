import { getPagination } from "../utils/pagination";
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

  const dateFields = [
    "suggestedStartDate",
    "completionDeadline",
    "completionDate",
  ];
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

async function buildRecurrence(task: Task, createdTask: any) {
  const {
    _id,
    appellant,
    recurrence,
    recurrenceEndDate,
    suggestedStartDate,
    completionDeadline,
  } = createdTask;
  if (!appellant) return;

  if (!recurrenceEndDate) {
    await TaskService.delete(_id);

    throw new ValidationError(
      "Não é possível criar uma tarefa recorrente sem os campos recurrenceEndDate."
    );
  }

  const tasksToCreate = [];
  let nextStartDate = new Date(suggestedStartDate);
  let nextDeadlineDate = new Date(completionDeadline);

  while (true) {
    let newStartDate = new Date(nextStartDate);
    let newDeadlineDate = new Date(nextDeadlineDate);

    switch (recurrence) {
      case "daily":
        newStartDate.setDate(newStartDate.getDate() + 1);
        newDeadlineDate.setDate(newDeadlineDate.getDate() + 1);
        break;
      case "weekly":
        newStartDate.setDate(newStartDate.getDate() + 7);
        newDeadlineDate.setDate(newDeadlineDate.getDate() + 7);
        break;
      case "monthly":
        newStartDate.setMonth(newStartDate.getMonth() + 1);
        newDeadlineDate.setMonth(newDeadlineDate.getMonth() + 1);
        break;
      case "annual":
        newStartDate.setFullYear(newStartDate.getFullYear() + 1);
        newDeadlineDate.setFullYear(newDeadlineDate.getFullYear() + 1);
        break;
      default:
        await TaskService.delete(createdTask._id);

        throw new ValidationError(`Valor ${recurrence} inexistente.`);
    }

    if (toDateOnly(newStartDate) > toDateOnly(new Date(recurrenceEndDate)))
      break;

    tasksToCreate.push({
      ...task,
      parentTask: _id,
      appellant: false,
      recurrence: null,
      recurrenceEndDate: null,
      suggestedStartDate: newStartDate,
      completionDeadline: newDeadlineDate,
    });

    nextStartDate = newStartDate;
    nextDeadlineDate = newDeadlineDate;
  }

  if (tasksToCreate.length) {
    await TaskService.createMany(tasksToCreate);
  }
}

function toDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

      const { page, limit, skip } = getPagination(filters);

      const [tasks, total] = await Promise.all([
        TaskService.findAll(filters, limit, skip),
        TaskService.count(filters),
      ]);

      response.json({
        data: tasks,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
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

      const task = request.body as Task;
      const createdTask = await TaskService.create(task);

      buildRecurrence(task, createdTask);

      response.status(201).send();
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
      const taskUpdated = await TaskService.update(
        request.params.id,
        request.body as Task
      );
      if (!taskUpdated) {
        throw new NotFoundError(
          `Tarefa com id ${request.params.id} não encontrada.`
        );
      }

      response.send(taskUpdated);
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
      if (!(await TaskService.delete(request.params.id))) {
        throw new NotFoundError(
          `Tarefa com id ${request.params.id} não encontrada.`
        );
      }

      response.status(204).send();
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      next(error);
    }
  }
}
