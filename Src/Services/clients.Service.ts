import ClientRepo from "../Repositories/Client.Repo";

import { CustomError } from "../Errors/CustomError";

class ClientService {
  // Create Client
  public async create(
    organizationId: string,
    data: {
      name: string;
      email?: string;
      phone?: string;
      company?: string;
      status?: string;
      notes?: string;
    },
  ) {
    const client = await ClientRepo.create({
      organizationId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status,
      notes: data.notes,
    });

    return client;
  }

  // Get All Clients
  public async getAll(organizationId: string) {
    return await ClientRepo.getAll(organizationId);
  }

  // Get Single Client
  public async getById(organizationId: string, clientId: string) {
    const client = await ClientRepo.getById(organizationId, clientId);

    if (!client) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    return client;
  }

  // Update Client
  public async update(
    organizationId: string,
    clientId: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      status?: string;
      notes?: string;
    },
  ) {
    const existingClient = await ClientRepo.getById(organizationId, clientId);

    if (!existingClient) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    const updatedClient = await ClientRepo.update(
      organizationId,
      clientId,
      data,
    );

    return updatedClient;
  }

  // Delete Client
  public async delete(organizationId: string, clientId: string) {
    const existingClient = await ClientRepo.getById(organizationId, clientId);

    if (!existingClient) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    await ClientRepo.delete(organizationId, clientId);

    return {
      message: "Client deleted successfully",
    };
  }
}

export default new ClientService();
