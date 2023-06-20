import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";

export function makeAuthenticateUseCase() {
  const usersRepository = new InMemoryUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(usersRepository);
  return authenticateUseCase;
}
