import { Constants } from "../Constants/Constants";
import { CustomError } from "../Errors/CustomError";
import { addEmailJob, EmailQueue } from "../Queues/Email.Queue";
import UserRepo from "../Repositories/User.Repo";
import { tokenUtils } from "../Utils/authTokenUtils";
import type { tokenValidator } from "../Validators/token.Validator";
import AuthRepo from "../Repositories/Auth.Repo";
import { redisUtils } from "../Utils/redis.Utils";
export const verificationService = {
  verifyEmailVerification: async (data: tokenValidator) => {
    const userId = await redisUtils.getRedis("verify-email", data.token);
    if (!userId)
      throw new CustomError(
        410,
        "Email verification link has been expired",
        "LINK_EXPIRED",
      );
    const updatedUser = await AuthRepo.updateIsEmailVerified(userId);
    if (!updatedUser)
      throw new CustomError(
        500,
        "something went wrong while verifying email",
        "COULD_NOT_VERIFY",
      );
    await redisUtils.deleteRedis("verify-email", userId);
    await redisUtils.deleteRedis(
      "verify-email",
      (await redisUtils.getRedis("verify-email", userId))!,
    );
    return true;
  },
  resendEmailVerification: async (email: string) => {
    const user = await UserRepo.findByEmail(email);
    if (!user)
      throw new CustomError(
        404,
        "User not found associated with this email",
        "USER_NOT_FOUND",
      );

    if (user.isEmailVerified)
      throw new CustomError(409, "Email already verified", "ALREADY_VERIFIED");
    let hashedToken = await redisUtils.getRedis("verify-email", user.id);
    if (hashedToken)
      throw new CustomError(
        409,
        "email verification link already sent",
        "ALREADY_SENT",
      );
    const token = await tokenUtils.generateToken();
    hashedToken = await tokenUtils.hashToken(token);
    await redisUtils.setRedis("verify-email", hashedToken, user.id);
    await redisUtils.setRedis("verify-email", user.id, hashedToken);
    await addEmailJob("verify-email", {
      email: user.email,
      fullName: user.fullName,
      verificationToken: token,
      expiresIn: Constants.tokenExpireTime,
    });
    return true;
  },
};
