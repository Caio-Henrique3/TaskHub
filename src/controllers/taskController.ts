import {
  Controller,
  Route,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Path,
  Query,
  Response,
  SuccessResponse,
  Tags,
  Security,
} from "tsoa";
import { TaskService } from "../services/taskService";
import { UserService } from "../services/userService";
import { ITask, Task, TaskModel } from "../models/taskModel";
import mongoose from "mongoose";
import { NotFoundError, ValidationError } from "../utils/errors";
import { getPagination } from "../utils/pagination";

interface PaginatedTasksResponse {
  data: Task[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TaskFilters {
  title?: string;
  description?: string;
  status?: string;
  recurrence?: string;
  user?: string[];
  suggestedStartDateFrom?: string;
  suggestedStartDateTo?: string;
  completionDeadlineFrom?: string;
  completionDeadlineTo?: string;
  completionDateFrom?: string;
  completionDateTo?: string;
}

@Route("tasks")
@Tags("Tasks")
export class TaskController extends Controller {
  @Get()
  @Security("bearerAuth")
  @Response<PaginatedTasksResponse>(
    200,
    "Lista de tarefas retornada com sucesso"
  )
  @Response<ValidationError>(400, "Parâmetros inválidos")
  public async findAll(
    @Query() title?: string,
    @Query() description?: string,
    @Query() status?: string,
    @Query() recurrence?: string,
    @Query() user?: string[],
    @Query() suggestedStartDateFrom?: string,
    @Query() suggestedStartDateTo?: string,
    @Query() completionDeadlineFrom?: string,
    @Query() completionDeadlineTo?: string,
    @Query() completionDateFrom?: string,
    @Query() completionDateTo?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<PaginatedTasksResponse> {
    try {
      const filters = {
        title,
        description,
        status,
        recurrence,
        user,
        suggestedStartDateFrom,
        suggestedStartDateTo,
        completionDeadlineFrom,
        completionDeadlineTo,
        completionDateFrom,
        completionDateTo,
      };

      const paginationParams = {
        page,
        limit,
      };

      const builtFilters = buildTaskFilters(filters);

      if (builtFilters.user) {
        await validateRelatedUser(builtFilters.user);
      }

      const { currentPage, currentLimit, skip } =
        getPagination(paginationParams);

      const [tasks, total] = await Promise.all([
        TaskService.findAll(builtFilters, currentLimit, skip),
        TaskService.count(builtFilters),
      ]);

      return {
        data: tasks.map((task) => toTaskResponse(task)),
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit),
      };
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      throw error;
    }
  }

  @Get("{id}")
  @Security("bearerAuth")
  @Response<Task>(200, "Tarefa encontrada")
  @Response<NotFoundError>(404, "Tarefa não encontrada")
  @Response<ValidationError>(400, "ID inválido")
  public async findById(@Path() id: string): Promise<Task> {
    try {
      const task = await TaskService.findById(id);
      if (!task) {
        throw new NotFoundError(`Tarefa com id ${id} não encontrada.`);
      }

      return toTaskResponse(task);
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      throw error;
    }
  }

  @Post()
  @Security("bearerAuth")
  @SuccessResponse(201, "Tarefa criada com sucesso")
  @Response<ValidationError>(400, "Dados inválidos")
  @Response<NotFoundError>(404, "Usuário relacionado não encontrado")
  public async create(@Body() requestBody: Task): Promise<void> {
    try {
      await validateRelatedUser(requestBody.user);

      const { _id, ...task } = requestBody as any;

      const createdTask = await TaskService.create(task);
      await buildRecurrence(task, createdTask);
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      throw error;
    }
  }

  @Put("{id}")
  @Security("bearerAuth")
  @Response<Task>(200, "Tarefa atualizada")
  @Response<NotFoundError>(404, "Tarefa não encontrada")
  @Response<ValidationError>(400, "Dados inválidos")
  public async update(
    @Path() id: string,
    @Body() requestBody: Task
  ): Promise<Task> {
    try {
      const taskUpdated = await TaskService.update(id, requestBody);
      if (!taskUpdated) {
        throw new NotFoundError(`Tarefa com id ${id} não encontrada.`);
      }

      return toTaskResponse(taskUpdated);
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }
      throw error;
    }
  }

  @Delete("{id}")
  @Security("bearerAuth")
  @SuccessResponse(204, "Tarefa deletada com sucesso")
  @Response<NotFoundError>(404, "Tarefa não encontrada")
  @Response<ValidationError>(400, "ID inválido")
  public async delete(@Path() id: string): Promise<void> {
    try {
      if (!(await TaskService.delete(id))) {
        throw new NotFoundError(`Tarefa com id ${id} não encontrada.`);
      }
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      throw error;
    }
  }
}

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

  Object.keys(filters).forEach((key) => {
    if (filters[key] === undefined) {
      delete filters[key];
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

async function buildRecurrence(task: ITask, createdTask: any) {
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

  const tasksToCreate: ITask[] = [];
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

    const newTask = new TaskModel({
      title: task.title,
      description: task.description,
      suggestedStartDate: newStartDate,
      completionDeadline: newDeadlineDate,
      completionDate: undefined,
      appellant: false,
      recurrence: undefined,
      recurrenceEndDate: undefined,
      status: task.status,
      user: task.user,
      parentTask: _id,
    });

    tasksToCreate.push(newTask);

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

function toTaskResponse(task: any): Task {
  return {
    ...task._doc,
    _id: task._id,
  };
}
