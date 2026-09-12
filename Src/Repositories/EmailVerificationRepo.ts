import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import email_verification_tokens from "../Database/Schemas/email_verification_tokens.Schema";
import { IEmail } from "../Interfaces/IEmail";
import type { TokenValidator } from "../Validators/TokenValidator";
import { eq } from "drizzle-orm";

class EmailVerificationRepo {
  public async create(tx: NodePgDatabase<any>, data: IEmail.create) {
    const token = await tx
      .insert(email_verification_tokens)
      .values({
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        claimedAt: null,
      })
      .returning();
    return token[0];
  }
  public async findByTokenHash(tx: NodePgDatabase<any>, tokenHash: string) {
    const doesExist = await tx
      .select()
      .from(email_verification_tokens)
      .where(eq(email_verification_tokens.tokenHash, tokenHash))
      .limit(1);
    return doesExist[0];
  }
}
export default new EmailVerificationRepo();
