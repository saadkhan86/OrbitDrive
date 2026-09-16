import z from "zod";

export const organizationValidator = {
  createValidator: z.object({
    name: z
      .string({
        error: (issue) =>
          issue.code === "invalid_type"
            ? `This ${issue.path} should be of type ${issue.expected}`
            : `This ${issue.path} is required`,
      })
      .min(5, { message: "name must be greater than 5 characters" })
      .max(100, { message: "name must be smaller than 100 characters" }),
    slug: z
      .string({
        error: (issue) =>
          issue.code == "invalid_type"
            ? `This ${issue.path} should be of type ${issue.expected}`
            : `This ${issue.path} is required`,
      })
      .min(5, { message: "slug must be grater than 4 characters" }),
  }),
  updateValidator: z
    .string({
      error: (issue) =>
        issue.code === "invalid_type"
          ? `This ${issue.path} should be of type ${issue.expected}`
          : `This ${issue.path} is required`,
    })
    .min(5, { message: "name must be greater than 5 characters" })
    .max(100, { message: "name must be smaller than 100 characters" }),
  slug: z
    .string({
      error: (issue) =>
        issue.code == "invalid_type"
          ? `This ${issue.path} should be of type ${issue.expected}`
          : `This ${issue.path} is required`,
    })
    .min(5, { message: "slug must be grater than 4 characters" }),
};
export type createOrganizationValidator = z.infer<
  typeof organizationValidator.createValidator
>;
export type updateOrganizationValidator = z.infer<
  typeof organizationValidator.updateValidator
>;
