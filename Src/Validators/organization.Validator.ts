import z, { object } from "zod";

export const organizationValidator = {
  create: z.object({
    name: z
      .string({
        error: (issue) =>
          issue.code === "invalid_type"
            ? `This ${issue.path} should be of type ${issue.expected}`
            : `This ${issue.path} is required`,
      })
      .min(5, { message: "name must be greater than 5 characters" })
      .max(100, { message: "name must be smaller than 100 characters" }),
  }),
  update: z
    .object({
      name: z
        .string({
          error: (issue) =>
            issue.code === "invalid_type"
              ? `This ${issue.path} should be of type ${issue.expected}`
              : `This ${issue.path} is required`,
        })
        .min(5, { message: "name must be greater than 5 characters" })
        .max(100, { message: "name must be smaller than 100 characters" })
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      abort: true,
      message: "At least one field is required",
    }),
  organizationId: z.object({
    organizationId: z
      .string({
        error: (issue) =>
          issue.code == "invalid_type"
            ? `This ${issue.path} should be of ${issue.expected} type`
            : `This ${issue.path} is required`,
      })
      .length(36, {
        error: (issue) =>
          issue.code == "too_big" || issue.code == "too_small"
            ? `This ${issue.path} must be of length ${issue.maximum ?? issue.minimum}`
            : undefined,
      }),
  }),
};
export type CreateOrganizationInputValidator = z.infer<
  typeof organizationValidator.create
>;
export type UpdateOrganizationInputValidator = z.infer<
  typeof organizationValidator.update
>;
export type OrganizationIdInputValidator = z.infer<
  typeof organizationValidator.organizationId
>;
export type OrganizationUpdateInputValidator = z.infer<
  typeof organizationValidator.update
>;
