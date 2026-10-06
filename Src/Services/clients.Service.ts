import ClientRepo from "../Repositories/Client.Repo";

import { CustomError } from "../Errors/CustomError";
import { VClient } from "../Validators/clients.Validator";

class ClientsService {
  public async create(organizationId: string, data: VClient.CreateClientInput) {
    return await ClientRepo.create({
      ...data,
      organizationId,
    });
  }

  public async getAll(organization: VClient.OrganizationIdParams) {
    return await ClientRepo.getAll(organization);
  }

  public async getById(client: VClient.ClientIdParams) {
    const foundClient = await ClientRepo.getById({ ...client });

    if (!foundClient) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    return foundClient;
  }

  public async update(
    client: VClient.ClientIdParams,
    data: VClient.UpdateClientInput,
  ) {
    return await ClientRepo.update({ ...client, ...data });
  }

  public async delete(data: VClient.ClientIdParams) {
    return await ClientRepo.delete({ ...data });
  }
}

export default new ClientsService();
