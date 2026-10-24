import type { FastifyReply, FastifyRequest } from "fastify";

import type { VDeal } from "../Validators/deal.Validator";
import dealService from "../Services/deal.Service";
import { VAuth } from "../Validators/auth.Validator";

class DealController {
  public async create(request: FastifyRequest, reply: FastifyReply) {
    const deal = await dealService.create(
      request.user as VAuth.userId,
      request.params as VDeal.organizationId,
      request.body as VDeal.create,
    );
    return reply.code(201).send({
      success: true,
      data: { deal },
    });
  }
  public async query(request: FastifyRequest, reply: FastifyReply) {
    const deals = await dealService.query(
      request.params as VDeal.organizationId,
    );

    return reply.code(200).send({
      success: true,
      data: { deals },
    });
  }
  public async findById(request: FastifyRequest, reply: FastifyReply) {
    const deal = await dealService.findById(
      request.params as VDeal.organizationId & VDeal.dealId,
    );

    return reply.code(200).send({
      success: true,
      data: { deal },
    });
  }

  public async update(request: FastifyRequest, reply: FastifyReply) {
    const deal = await dealService.update(
      request.user as VAuth.userId,
      request.params as VDeal.dealId & VDeal.organizationId,
      request.body as VDeal.update,
    );

    return reply.code(200).send({
      success: true,
      data: deal,
    });
  }

  public async delete(request: FastifyRequest, reply: FastifyReply) {
    const result = await dealService.delete(
      request.user as VAuth.userId,
      request.params as VDeal.organizationId & VDeal.dealId,
    );

    return reply.code(204).send({
      success: true,
      message: "Deal deleted successfully",
      data: [],
    });
  }
}

export default new DealController();
