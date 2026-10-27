import ClientRepo from "../Repositories/Client.Repo";

import { CustomError } from "../Errors/CustomError";
import { VClient } from "../Validators/clients.Validator";
import auditLogRepo from "../Repositories/auditLog.Repo";
import { VAuth } from "../Validators/auth.Validator";
import { db } from "../Database";
import { clients } from "../Database/Schemas/clients.Schema";

class ClientsService {
  public async create(
    user: VAuth.userId,
    organization: VClient.OrganizationIdParams,
    data: VClient.CreateClientInput,
  ) {
    const client = await db.transaction(async (tx) => {
      const createdClient: NonNullable<any> = await ClientRepo.create(tx, {
        ...data,
        organizationId: organization.organizationId,
      });

      await auditLogRepo.create(tx, {
        organizationId: createdClient.organizationId,
        action: "create",
        userId: user.userId,
        entityType: "client",
        entityId: createdClient.id,
        metadata: {
          company: createdClient.company,
          email: createdClient.email,
        },
      });
      return createdClient;
    })
    return client;
  }

  public async query(organization: VClient.OrganizationIdParams, query: VClient.query) {
    const clients = await ClientRepo.query({ ...organization, ...query });
    return clients;
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
      if (!updated) throw new CustomError(500, "something went wrong while updating client", "SERVER_ERROR")
      await auditLogRepo.create(tx, {
        organizationId: client.organizationId,
        action: "update",
        userId: user.userId,
        entityType: "client",
        entityId: updated.id,
        metadata: {
          company: updated.company,
          email: updated.email,
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
        action: "delete",
        userId: user.userId,
        entityType: "client",
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
