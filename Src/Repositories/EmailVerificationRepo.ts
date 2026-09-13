import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import email_verification_tokens from "../Database/Schemas/email_verification_tokens.Schema";
import { IEmail } from "../Interfaces/IEmail";
import type { TokenValidator } from "../Validators/TokenValidator";
import { eq } from "drizzle-orm";
import { any } from "zod";
import { db } from "../Database";

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
    const token = await tx
      .select()
      .from(email_verification_tokens)
      .where(eq(email_verification_tokens.tokenHash, tokenHash))
      .limit(1);
    return token[0];
  }
  public async findByUserId(userId: string) {
    const token = await db
      .select()
      .from(email_verification_tokens)
      .where(eq(email_verification_tokens.userId, userId))
      .limit(1);
    return token[0];
  }
  public async update(tx: NodePgDatabase<any>, data: IEmail.update) {
    let newData: Record<string, any> = {};
    if (data.tokenHash || data.tokenHash === null)
      newData.tokenHash = data.tokenHash;
    if (data.expiresAt || data.expiresAt === null)
      newData.expiresAt = data.expiresAt;
    if (data.claimedAt || data.claimedAt == null)
      newData.claimedAt = data.claimedAt;
    const updatedToken = await tx
      .update(email_verification_tokens)
      .set(newData)
      .where(eq(email_verification_tokens.id, data.id))
      .returning();
    return updatedToken[0];
  }
  public async resendVerificationEmail(
    tx: NodePgDatabase<any>,
    email: string,
  ) {}
}
export default new EmailVerificationRepo();
