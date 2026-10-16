import ClientRepo from "../Repositories/Client.Repo";

import { CustomError } from "../Errors/CustomError";
import { VClient } from "../Validators/clients.Validator";
import auditLogRepo from "../Repositories/auditLog.Repo";
import { VAuth } from "../Validators/auth.Validator";
import { email } from "zod";

class ClientsService {
  public async create(
    user: VAuth.userId,
    organization: VClient.OrganizationIdParams,
    data: VClient.CreateClientInput,
  ) {
    const client = await ClientRepo.create({
      ...data,
      organizationId: organization.organizationId,
    });
    if (!client)
      throw new CustomError(
        500,
        "Something Went wrong while creating client",
        "SOMETHING WENT WRONG",
      );
    await auditLogRepo.create({
      organizationId: client.organizationId,
      action: "CLIENT CREATED",
      userId: user.userId,
      entityType: "Client",
      entityId: client.id,
      metadata: {
        company: client.company,
        email: client.email,
      },
    });
    return client;
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
    user: VAuth.userId,
    client: VClient.ClientIdParams,
    data: VClient.UpdateClientInput,
  ) {
    const updatedClient = await ClientRepo.update({ ...client, ...data });
    if (!updatedClient)
      throw new CustomError(404, "Client Not Found", "NOT_FOUND");
    await auditLogRepo.create({
      organizationId: client.organizationId,
      action: "CLIENT UPDATED",
      userId: user.userId,
      entityType: "Client",
      entityId: updatedClient.id,
      metadata: {
        company: updatedClient.company,
        email: updatedClient.email,
      },
    });
    return;
  }

  public async delete(user: VAuth.userId, data: VClient.ClientIdParams) {
    const client = await ClientRepo.delete({ ...data });
    if (!client) throw new CustomError(404, "Client Not Found", "NOT_FOUND");
    await auditLogRepo.create({
      organizationId: client.organizationId,
      action: "CLIENT DELETED",
      userId: user.userId,
      entityType: "Client",
      entityId: client.id,
      metadata: {
        company: client.company,
        email: client.email,
      },
    });
    return client;
  }
}

export default new ClientsService();
