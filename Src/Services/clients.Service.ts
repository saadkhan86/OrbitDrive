import ClientRepo from "../Repositories/Client.Repo";

import { CustomError } from "../Errors/CustomError";
import {
  CreateClientInput,
  UpdateClientInput,
} from "../Validators/clients.Validator";

class ClientsService {
  public async create(organizationId: string, data: CreateClientInput) {
    return await ClientRepo.create({
      ...data,
      organizationId,
    });
  }

  public async getAll(organizationId: string) {
    return await ClientRepo.getAll(organizationId);
  }

  public async getById(organizationId: string, clientId: string) {
    const client = await ClientRepo.getById(organizationId, clientId);

    if (!client) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    return client;
  }

  public async update(
    organizationId: string,
    clientId: string,
    data: UpdateClientInput,
  ) {
    return await ClientRepo.update(organizationId, clientId, data);
  }

  public async delete(organizationId: string, clientId: string) {
    return await ClientRepo.delete(organizationId, clientId);
  }
}

export default new ClientsService();
