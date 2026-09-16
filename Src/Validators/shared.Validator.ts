import z from "zod";

export const sharedValidator = {
  idValidator: z
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
};
export type idValidator = z.infer<typeof sharedValidator.idValidator>;
