import ClientRepo from "../Repositories/Client.Repo";

import { CustomError } from "../Errors/CustomError";
import { VClient } from "../Validators/clients.Validator";
import auditLogRepo from "../Repositories/auditLog.Repo";
import { VAuth } from "../Validators/auth.Validator";
import { db } from "../Database";

class ClientsService {
  public async create(
    user: VAuth.userId,
    organization: VClient.OrganizationIdParams,
    data: VClient.CreateClientInput,
  ) {
    const client = await db.transaction(async (tx) => {
      const createdClient = await ClientRepo.create(tx, {
        ...data,
        organizationId: organization.organizationId,
      });
      await auditLogRepo.create(tx, {
        organizationId: createdClient!.organizationId,
        action: "CLIENT CREATED",
        userId: user.userId,
        entityType: "Client",
        entityId: createdClient!.id,
        metadata: {
          company: createdClient!.company,
          email: createdClient!.email,
        },
      });
      return createdClient;
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
    const updatedClient = await db.transaction(async (tx) => {
      const updated = await ClientRepo.update(tx, { ...client, ...data });
      await auditLogRepo.create(tx, {
        organizationId: client.organizationId,
        action: "CLIENT UPDATED",
        userId: user.userId,
        entityType: "Client",
        entityId: updated!.id,
        metadata: {
          company: updated!.company,
          email: updated!.email,
        },
      });
      return updated;
    });
    return updatedClient;
  }

  public async delete(user: VAuth.userId, data: VClient.ClientIdParams) {
    const client = await db.transaction(async (tx) => {
      const foundClient = await ClientRepo.getById({ ...data });
      if (!foundClient) throw new CustomError(404, "Client Not Found", "NOT_FOUND");
      await ClientRepo.delete(tx, { ...data });
      await auditLogRepo.create(tx, {
        organizationId: foundClient.organizationId,
        action: "CLIENT DELETED",
        userId: user.userId,
        entityType: "Client",
        entityId: data.clientId,
        metadata: {
          company: foundClient.company,
          email: foundClient.email,
        },
      });
    });
    return true
  }
}

export default new ClientsService();
