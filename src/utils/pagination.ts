import { ValidationError } from "./errors";

export function getPagination(query: any) {
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (
    (query.page !== undefined && (isNaN(page) || page < 1)) ||
    (query.limit !== undefined && (isNaN(limit) || limit < 1))
  ) {
    throw new ValidationError(
      "Parâmetros de paginação inválidos: 'page' e 'limit' devem ser inteiros positivos."
    );
  }

  delete query.page;
  delete query.limit;

  return {
    page: page || 1,
    limit: limit || 10,
    skip: ((page || 1) - 1) * (limit || 10),
  };
}
