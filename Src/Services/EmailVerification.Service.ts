import { Constants } from "../Constants/Constants";
import { db } from "../Database";
import { CustomError } from "../Errors/CustomError";
import { EmailQueue } from "../Queues/Email.Queue";
import EmailVerificationRepo from "../Repositories/EmailVerificationRepo";
import UserRepo from "../Repositories/UserRepo";
import { TokenRouter } from "../Router/TokenRouter";
import { EmailTokenUtils } from "../Utils/EmailTokenUtils";
import type { TokenValidator } from "../Validators/TokenValidator";

export const EmailVerificationService = {
  emailVerificationUpdate: async (data: TokenValidator) => {
    await db.transaction(async (tx) => {
      const tokenHash = await EmailTokenUtils.hashEmailVerificationToken(
        data.token,
      );
      const emailVerification = await EmailVerificationRepo.findByTokenHash(
        tx,
        tokenHash,
      );
      if (!emailVerification)
        throw new CustomError(400, "invalid token", "INVALID_TOKEN");

      if (emailVerification.claimedAt != null)
        throw new CustomError(400, "token already used", "TOKEN_ALREADY_USED");

      if (Date.now() > emailVerification.expiresAt!.getTime())
        throw new CustomError(400, "token expired", "TOKEN_EXPIRED");

      await EmailVerificationRepo.update(tx, {
        id: emailVerification.id,
        claimedAt: new Date(),
        tokenHash: null,
        expiresAt: null,
      });
      const updatedUser = await UserRepo.updatedIsEmailVerified(
        tx,
        emailVerification.userId,
      );
      if (!updatedUser)
        throw new CustomError(
          500,
          "something went wrong while verifying email",
          "COULD_NOT_VERIFY",
        );
    });

    return true;
  },
  resendVerificationEmail: async (email: string) => {
    const user = await UserRepo.findByEmail(email);
    if (!user)
      throw new CustomError(
        404,
        "User not found associated with this email",
        "USER_NOT_FOUND",
      );

    if (user?.isEmailVerified)
      throw new CustomError(409, "Email already verified", "ALREADY_VERIFIED");
    const isTokenAlreadyExists = await EmailVerificationRepo.findByUserId(
      user.id,
    );
    if (!isTokenAlreadyExists)
      throw new CustomError(
        500,
        "something went wrong while processing your request",
        "SOMETHING_WENT_WRONG",
      );
    const token = await EmailTokenUtils.generateEmailVerificationToken();
    const tokenHash = await EmailTokenUtils.hashEmailVerificationToken(token);
    const expiresAt = new Date(
      Date.now() +
        Constants.emailVerificationTokenExpirationMinutes * 60 * 1000,
    );
    await EmailVerificationRepo.update(db, {
      id: isTokenAlreadyExists.id,
      tokenHash,
      expiresAt,
      claimedAt: null,
    });
    await EmailQueue.add("verify-email", {
      email: user.email,
      fullName: user.fullName,
      verificationToken: token,
      expiresIn: Constants.emailVerificationTokenExpirationMinutes,
    });
    return true;
  },
};
