import * as argon2 from "argon2";
import { VAuth } from "./auth.validator";
import AuthRepo from "./Auth.repo";
import { CustomError } from "../../ErrorHandler/CustomError";
import { tokenUtils } from "../../Utils/authToken.utils";
import { addEmailJob } from "../../Queues/email.queue";
import { Constants } from "../../Constants/constants";
import { redisUtils } from "../../Utils/redis.utils";
import UserRepo from "../User/User.repo";

export const authService = {
  signup: async (body: VAuth.create) => {
    const isExist = await AuthRepo.findByEmail({ email: body.email });
    if (isExist && !isExist.isEmailVerified)
      throw new CustomError(
        409,
        "Email already exists email verification is pending",
        "EMAIL_ALREADY_EXISTS",
      );
    if (isExist && isExist.isEmailVerified)
      throw new CustomError(
        409,
        "Email already exists",
        "EMAIL_ALREADY_EXISTS",
      );
    const passwordHash = await argon2.hash(body.password);
    const token = await tokenUtils.generateToken();
    const hashedToken = await tokenUtils.hashToken(token);
    const user = await AuthRepo.create({
      ...body,
      passwordHash,
    });
    if (!user)
      throw new CustomError(
        500,
        "something went wrong",
        "SOMETHING_WENT_WRONG",
      );
    await addEmailJob("verify-email", {
      email: user.email,
      fullName: user.fullName,
      verificationToken: token,
      expiresIn: Constants.tokenExpireTime,
    });
    await redisUtils.setRedis("verify-email", hashedToken, user.id);
    await redisUtils.setRedis("verify-email", user.id, hashedToken);
    return user;
  },
  login: async (body: VAuth.login) => {
    const user = await AuthRepo.findByEmail({ email: body.email });
    if (!user)
      throw new CustomError(401, "User does not exist", "USER_NOT_FOUND");
    if (!user.isEmailVerified)
      throw new CustomError(
        403,
        "Email verification is pending.Verify your email first",
        "EMAIL_VERIFICATION_PENDING",
      );
    const isMatch = await argon2.verify(user.passwordHash, body.password);
    if (!isMatch)
      throw new CustomError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    const refreshToken = await tokenUtils.generateToken();
    await AuthRepo.updateRefreshToken({
      userId: user.id,
      refreshToken,
    });
    return { refreshToken, user };
  },
  forgotPassword: async (body: VAuth.email) => {
    const user = await AuthRepo.findByEmail({ email: body.email });
    if (!user)
      throw new CustomError(
        404,
        "User not found associated with this email",
        "USER_NOT_FOUND",
      );
    if (!user.isEmailVerified)
      throw new CustomError(
        403,
        "User email is not verified",
        "EMAIL_NOT_VERIFIED",
      );
    if (await redisUtils.getRedis("password-reset", user.id)) {
      throw new CustomError(
        400,
        "password reset link has been already sent",
        "ALREADY_SENT",
      );
    }
    const token = await tokenUtils.generateToken();
    const hashedToken = await tokenUtils.hashToken(token);
    await addEmailJob("password-reset", {
      email: user.email,
      fullName: user.fullName,
      verificationToken: token,
      expiresIn: Constants.tokenExpireTime,
    });
    await redisUtils.setRedis("password-reset", hashedToken, user.id);
    await redisUtils.setRedis("password-reset", user.id, hashedToken);
    return true;
  },
  passwordReset: async (body: VAuth.passwordReset) => {
    const hashedToken = await tokenUtils.hashToken(body.token);
    const userId = await redisUtils.getRedis("password-reset", hashedToken);
    if (!userId)
      throw new CustomError(400, "Invalid or expired token", "INVALID_TOKEN");
    await redisUtils.deleteRedis("password-reset", hashedToken);
    await redisUtils.deleteRedis("password-reset", userId);
    const passwordHash = await argon2.hash(body.password);
    await UserRepo.update({
      userId,
      password: passwordHash,
    });
    return true;
  },
  refresh: async (param: VAuth.refreshToken) => {
    const user = await AuthRepo.findByRefreshToken({
      refreshToken: param.refreshToken,
    });
    if (!user)
      throw new CustomError(
        400,
        "Invalid Token! try to login",
        "INVALID_TOKEN",
      );
    const refreshToken = await tokenUtils.generateToken();
    await AuthRepo.updateRefreshToken({
      refreshToken,
      userId: user.id,
    });
    return { refreshToken, userId: user.id };
  },
};
