import type { FastifyReply, FastifyRequest } from "fastify";

import type { VDeal } from "../Validators/deal.Validator";
import dealService from "../Services/deal.Service";

class DealController {
  public async create(request: FastifyRequest, reply: FastifyReply) {
    const deal = await dealService.create(
      request.params as VDeal.organizationId,
      request.body as VDeal.create,
    );
    return reply.code(201).send({
      success: true,
      data: { deal },
    });
  }
  public async findAll(request: FastifyRequest, reply: FastifyReply) {
    const deals = await dealService.findAll(
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
      request.params as VDeal.organizationId & VDeal.dealId,
    );

    return reply.code(200).send({
      success: true,
      data: {},
    });
  }
}

export default new DealController();
