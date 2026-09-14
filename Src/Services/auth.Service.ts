import { Constants } from "../Constants/Constants";
import { db } from "../Database";
import { CustomError } from "../Errors/CustomError";
import { EmailQueue } from "../Queues/Email.Queue";
import UserRepo from "../Repositories/User.Repo";
import { tokenUtils } from "../Utils/authTokenUtils";
import { loginValidator, signupValidator } from "../Validators/user.Validator";
import * as argon2 from "argon2";
import VerificationRepo from "../Repositories/Verification.Repo";
import AuthRepo from "../Repositories/Auth.Repo";
import { authRouter } from "../Router/auth.Router";

export const authService = {
  signup: async (data: signupValidator) => {
    const isExist = await UserRepo.findByEmail(data.email);
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
    const verificationToken = await tokenUtils.generateToken();
    const hashedVerificationToken =
      await tokenUtils.hashToken(verificationToken);
    const expiresAt = new Date(
      Date.now() + Constants.tokenExpireTime * 60 * 1000,
    );
    const user = await db.transaction(async (tx) => {
      const createdUser = await AuthRepo.signup(tx, { ...data, passwordHash });
      await VerificationRepo.create(tx, {
        userId: createdUser!.id,
        tokenHash: hashedVerificationToken,
        expiresAt,
      });
      return createdUser;
    });
    await EmailQueue.add("email-verification", {
      email: user!.email,
      fullName: user!.fullName,
      verificationToken,
      expiresIn: Constants.tokenExpireTime,
    });
    return user;
  },
  login: async (data: loginValidator) => {
    const user = await UserRepo.findByEmail(data.email);
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
    const { passwordHash, ...userWithoutPassword } = user;
    const refreshToken = await tokenUtils.generateToken();
    await AuthRepo.updateRefreshToken(refreshToken, user.id);
    return { refreshToken, userId: user.id };
  },
  forgotPassword: async (
    email: string,
    tokenGenerator: (id: string) => string,
  ) => {
    const user = await UserRepo.findByEmail(email);
    if (!user)
      throw new CustomError(
        404,
        "User not found associated with this email",
        "USER_NOT_FOUND",
      );
    if (!user?.isEmailVerified)
      throw new CustomError(
        403,
        "User email is not verified",
        "EMAIL_NOT_VERIFIED",
      );
    const token = tokenGenerator(user.id);
    await EmailQueue.add("password-reset", {
      email: user.email,
      fullName: user.fullName,
      verificationToken: token,
      expiresIn: Constants.tokenExpireTime,
    });
    return true;
  },
  passwordReset: async (userId: string, password: string) => {
    const passwordHash = await argon2.hash(password);
    await UserRepo.update(userId, { passwordHash });
    return true;
  },
  refresh: async (token: string) => {
    const user = await AuthRepo.findByRefreshToken(token);
    if (!user)
      throw new CustomError(
        400,
        "Invalid Token! try to login",
        "INVALID_TOKEN",
      );
    const refreshToken = await tokenUtils.generateToken();
    await AuthRepo.updateRefreshToken(user?.id, refreshToken);
    return { refreshToken, userId: user.id };
  },
};
