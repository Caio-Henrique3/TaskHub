import { UserService } from "../services/userService";
import { User, UserResponse } from "../models/userModel";
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";
import { NotFoundError, ValidationError } from "../utils/errors";
import mongoose from "mongoose";
import { getPagination } from "../utils/pagination";

interface PaginatedUsersResponse {
  data: UserResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  @Get()
  @Response<PaginatedUsersResponse>(200, "Usuários encontrados")
  public async findAll(
    @Query() email?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<PaginatedUsersResponse> {
    try {
      const filters: any = {};
      const paginationParams = {
        page,
        limit,
      };

      if (email) {
        filters.email = { $regex: email, $options: "i" };
      }

      const { currentPage, currentLimit, skip } =
        getPagination(paginationParams);

      const [users, total] = await Promise.all([
        UserService.findAll(filters, limit, skip),
        UserService.count(filters),
      ]);

      return {
        data: users.map(toUserResponse),
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit),
      };
    } catch (error: any) {
      throw error;
    }
  }

  @Get("{id}")
  @Security("bearerAuth")
  @SuccessResponse<User>(200, "Usuário encontrado")
  @Response<NotFoundError>(404, "Usuário não encontrado")
  @Response<ValidationError>(400, "ID inválido")
  public async findById(@Path() id: string): Promise<UserResponse> {
    try {
      const user = await UserService.findById(id);
      if (!user) {
        throw new NotFoundError(`Tarefa com id ${id} não encontrada.`);
      }

      return toUserResponse(user);
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      throw error;
    }
  }

  @Post()
  @Security("bearerAuth")
  @SuccessResponse(201, "Usuário criado com sucesso")
  @Response<ValidationError>(400, "Dados inválidos")
  public async create(@Body() requestBody: User): Promise<void> {
    try {
      const { email, password } = requestBody;

      const createdUser = await UserService.register(email, password);
    } catch (error: any) {
      throw error;
    }
  }

  @Put("{id}")
  @Security("bearerAuth")
  @Response<UserResponse>(200, "Usuário atualizado com sucesso")
  @Response<NotFoundError>(404, "Usuário não encontrado")
  @Response<ValidationError>(400, "Dados inválidos")
  public async update(
    @Path() id: string,
    @Body() requestBody: User
  ): Promise<UserResponse> {
    try {
      const userUpdated = await UserService.update(id, requestBody);
      if (!userUpdated) {
        throw new NotFoundError(`Usuário com id ${id} não encontrado.`);
      }

      return toUserResponse(userUpdated);
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      throw error;
    }
  }

  @Delete("{id}")
  @Security("bearerAuth")
  @SuccessResponse(204, "Usuário deletado com sucesso")
  @Response<NotFoundError>(404, "Usuário não encontrado")
  @Response<ValidationError>(400, "ID inválido")
  public async delete(@Path() id: string): Promise<void> {
    try {
      if (!(await UserService.delete(id))) {
        throw new NotFoundError(`Usuário com id ${id} não encontrado.`);
      }
    } catch (error: any) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError(`Id ${error.value} é inválido.`);
      }

      throw error;
    }
  }
}

function toUserResponse(user: any): User {
  const { password, __v, ...userResponse } = user._doc;

  return userResponse;
}
