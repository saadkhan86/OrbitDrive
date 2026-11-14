import { Client } from "pg";
import { db } from "../../Database";
import { CustomError } from "../../ErrorHandler/CustomError";
import AuditLogRepo from "../AuditLog/AuditLog.repo";
import { VAuth } from "../Auth/auth.validator";
import ClientRepo from "./Client.repo";
import { VClient } from "./clients.validator";

class ClientsService {
  public async create(
    user: VAuth.userId,
    param: VClient.organizationId,
    body: VClient.create,
  ) {
    const client = await db.transaction(async (tx) => {
      const createdClient: NonNullable<any> = await ClientRepo.create(tx, {
        ...body,
        organizationId: param.organizationId,
      });

      await AuditLogRepo.create(tx, {
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
  public async query(param: VClient.organizationId, query: VClient.query) {
    const clients = await ClientRepo.query({ ...param, ...query });
    return clients;
  }
  public async getById(param: VClient.clientId) {
    const foundClient = await ClientRepo.getById({ ...param });

    if (!foundClient) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    return foundClient;
  }
  public async update(
    user: VAuth.userId,
    param: VClient.clientId,
    body: VClient.update,
  ) {
    const updatedClient = await db.transaction(async (tx) => {
      const updated = await ClientRepo.update(tx, { ...param, ...body });
      if (!updated) throw new CustomError(500, "something went wrong while updating client", "SERVER_ERROR")
      await AuditLogRepo.create(tx, {
        organizationId: param.organizationId,
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
  public async delete(user: VAuth.userId, data: VClient.clientId) {
    const client = await db.transaction(async (tx) => {
      const foundClient = await ClientRepo.getById({ ...data });
      if (!foundClient) throw new CustomError(404, "Client Not Found", "NOT_FOUND");
      await ClientRepo.delete(tx, { ...data });
      await AuditLogRepo.create(tx, {
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
