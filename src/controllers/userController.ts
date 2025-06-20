import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
import { NotFoundError, ValidationError } from "../utils/errors";
import mongoose from "mongoose";
import { getPagination } from "../utils/pagination";

function buildUserFilter(query: any) {
  const filters: any = { ...query };

  if (filters.email) {
    filters.email = { $regex: filters.email, $options: "i" };
  }

  return filters;
}
export class UserController {
  static async findAll(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const filters = buildUserFilter(request.query);

      const { page, limit, skip } = getPagination(filters);

      const [users, total] = await Promise.all([
        UserService.findAll(filters, limit, skip),
        UserService.count(filters),
      ]);

      response.send({
        data: users,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async findById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserService.findById(request.params.id);
      if (!user) {
        throw new NotFoundError(
          `Usuário com id ${request.params.id} não encontrado.`
        );
      }

      response.send(user);
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      next(error);
    }
  }

  static async register(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { email, password } = request.body;
    try {
      const user = await UserService.register(email, password);

      response.status(201).send();
    } catch (error: any) {
      next(error);
    }
  }

  static async update(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const userUpdated = await UserService.update(
        request.params.id,
        request.body
      );
      if (!userUpdated) {
        throw new NotFoundError(
          `Usuário com id ${request.params.id} não encontrado.`
        );
      }

      response.send(userUpdated);
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
      if (!(await UserService.delete(request.params.id))) {
        throw new NotFoundError(
          `Usuário com id ${request.params.id} não encontrado.`
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
