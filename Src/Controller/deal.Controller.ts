import type { FastifyReply, FastifyRequest } from "fastify";

import dealService from "../Services/deal.Service";
import type { VDeal } from "../Validators/deal.Validator";

class DealController {
  public async create(
    request: FastifyRequest<{
      Body: VDeal.create;
    }>,
    reply: FastifyReply,
  ) {
    const organizationId = request.user.organizationId;

    const deal = await dealService.create(organizationId, request.body);

    return reply.code(201).send({
      success: true,
      data: deal,
    });
  }

  public async findById(
    request: FastifyRequest<{
      Params: VDeal.dealId;
    }>,
    reply: FastifyReply,
  ) {
    const organizationId = request.user.organizationId;

    const deal = await dealService.findById(
      request.params.dealId,
      organizationId,
    );

    return reply.code(200).send({
      success: true,
      data: deal,
    });
  }

  public async findAll(request: FastifyRequest, reply: FastifyReply) {
    const organizationId = request.user.organizationId;

    const deals = await dealService.findAll(organizationId);

    return reply.code(200).send({
      success: true,
      data: deals,
    });
  }

  public async update(
    request: FastifyRequest<{
      Params: VDeal.dealId;
      Body: VDeal.update;
    }>,
    reply: FastifyReply,
  ) {
    const organizationId = request.user.organizationId;

    const deal = await dealService.update(
      request.params.dealId,
      organizationId,
      request.body,
    );

    return reply.code(200).send({
      success: true,
      data: deal,
    });
  }

  public async delete(
    request: FastifyRequest<{
      Params: VDeal.dealId;
    }>,
    reply: FastifyReply,
  ) {
    const organizationId = request.user.organizationId;

    const result = await dealService.delete(
      request.params.dealId,
      organizationId,
    );

    return reply.code(200).send({
      success: true,
      data: result,
    });
  }
}

export default new DealController();
