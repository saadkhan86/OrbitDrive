import * as crypto from "node:crypto";
export const tokenUtils = {
  generateToken: async (size = 32): Promise<string> => {
    return crypto.randomBytes(size).toString("hex");
  },
  hashToken: async (token: string): Promise<string> => {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
};
