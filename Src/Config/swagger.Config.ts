import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const swaggerConfig = async (app: FastifyInstance) => {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Orbit Drive",
        description: "Orbit Drive API",
        version: "1.0.0",
      },
      // tags: [
      //   {
      //     name: "Auth",
      //     description: "Authentication endpoints",
      //   },
      //   {
      //     name: "Users",
      //     description: "User management endpoints",
      //   },
      //   {
      //     name: "Organizations",
      //     description: "Organization management endpoints",
      //   },
      //   {
      //     name: "Organizations Invitations",
      //     description: "Organization invitations management endpoints",
      //   },
      //   {
      //     name: "Organizations Members",
      //     description: "Organization members management endpoints",
      //   },
      //   {
      //     name: "Clients",
      //     description: "Client management endpoints",
      //   },
      //   {
      //     name: "Deals",
      //     description: "Deal management endpoints",
      //   },
      //   {
      //     name: "Tasks",
      //     description: "Task management endpoints",
      //   },
      // ],
      servers: [{ url: process.env.APP_URL! }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT authentication",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });
  await app.register(fastifySwaggerUi, {
    routePrefix: "/swagger",
  });
  return;
};
