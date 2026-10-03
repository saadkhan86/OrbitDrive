import { Constants } from "../Constants/Constants";
import { CustomError } from "../Errors/CustomError";
import { addEmailJob } from "../Queues/Email.Queue";
import UserRepo from "../Repositories/User.Repo";
import { tokenUtils } from "../Utils/authTokenUtils";
import * as argon2 from "argon2";
import AuthRepo from "../Repositories/Auth.Repo";
import { redisUtils } from "../Utils/redis.Utils";
import { VAuth } from "../Validators/auth.Validator";

export const authService = {
  signup: async (data: VAuth.create) => {
    const isExist = await UserRepo.findByEmail(data as VAuth.email);
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
    const passwordHash = await argon2.hash(data.password);
    const token = await tokenUtils.generateToken();
    const hashedToken = await tokenUtils.hashToken(token);
    const user = await AuthRepo.create({
      ...data,
      password: passwordHash,
    } as VAuth.create);
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
  login: async (data: VAuth.login) => {
    const user = await UserRepo.findByEmail(data as VAuth.email);
    if (!user)
      throw new CustomError(401, "User does not exist", "USER_NOT_FOUND");
    if (!user.isEmailVerified)
      throw new CustomError(
        403,
        "Email verification is pending.Verify your email first",
        "EMAIL_VERIFICATION_PENDING",
      );
    const isMatch = await argon2.verify(user.passwordHash, data.password);
    if (!isMatch)
      throw new CustomError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    const refreshToken = await tokenUtils.generateToken();
    await AuthRepo.updateRefreshToken({
      userId: user.id,
      refreshToken,
    } as VAuth.updateRefreshToken);
    return { refreshToken, userId: user.id };
  },
  forgotPassword: async (data: VAuth.email) => {
    const user = await UserRepo.findByEmail(data as VAuth.email);
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
  passwordReset: async (data: VAuth.passwordReset) => {
    const hashedToken = await tokenUtils.hashToken(data.token);
    const userId = await redisUtils.getRedis("password-reset", hashedToken);
    if (!userId)
      throw new CustomError(400, "Invalid or expired token", "INVALID_TOKEN");
    await redisUtils.deleteRedis("password-reset", hashedToken);
    await redisUtils.deleteRedis("password-reset", userId);
    const passwordHash = await argon2.hash(data.password);
    await UserRepo.update({ userId } as VAuth.userId, {
      password: passwordHash,
    });
    return true;
  },
  refresh: async (data: VAuth.refreshToken) => {
    const user = await AuthRepo.findByRefreshToken(data);
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
    } as VAuth.updateRefreshToken);
    return { refreshToken, userId: user.id };
  },
};
