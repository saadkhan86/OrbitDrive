import * as crypto from "node:crypto";
export const tokenUtils = {
  generateEmailVerificationToken: async (size = 32): Promise<string> => {
    return crypto.randomBytes(size).toString("hex");
  },
  hashEmailVerificationToken: async (token: string): Promise<string> => {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
};
