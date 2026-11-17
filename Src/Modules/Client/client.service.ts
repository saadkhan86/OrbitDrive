import { db } from "../../Database";
import { CustomError } from "../../ErrorHandler/CustomError";
import { IReply } from "../../Interfaces/IReply";
import AuditLogRepo from "../AuditLog/AuditLog.repo";
import { VAuth } from "../Auth/auth.validator";
import ClientRepo from "./Client.repo";
import { VClient } from "./client.validator";

export const clientService = {
  create: async (
    user: VAuth.userId,
    param: VClient.organizationId,
    body: VClient.create,
  ) => {
    const client = await db.transaction(async (tx) => {
      const createdClient = await ClientRepo.create(tx, {
        organizationId: param.organizationId,
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        status: body.status,
        notes: body.notes
      });
      if (!createdClient) {
        throw new CustomError(500, "client not created", "SERVER_ERROR")
      }
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
  },
  query: async (param: VClient.organizationId, query: VClient.query): Promise<IReply.queryReturn> => {
    const { clients, count } = await ClientRepo.query({ ...param, ...query });
    const hasNextPage = count > query.limit
    return { data: clients, pagination: { limit: query.limit, hasNextPage, totalCount: count } };
  },
  getById: async (param: VClient.clientId) => {
    const foundClient = await ClientRepo.getById({ ...param });

    if (!foundClient) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    return foundClient;
  },
  update: async (
    user: VAuth.userId,
    param: VClient.clientId,
    body: VClient.update,
  ) => {
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
  },
  delete: async (user: VAuth.userId, data: VClient.clientId) => {
    const client = await db.transaction(async (tx) => {
      const deleted = await ClientRepo.delete(tx, { ...data });
      if (!deleted) throw new CustomError(404, "Client Not Found", "NOT_FOUND");
      await AuditLogRepo.create(tx, {
        organizationId: deleted.organizationId,
        action: "delete",
        userId: user.userId,
        entityType: "client",
        entityId: data.clientId,
        metadata: {
          company: deleted.company,
          email: deleted.email,
        },
      });
    });
    return true
  }
}

