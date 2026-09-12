import UserRepo from "../Repositories/UserRepo";
import type {
  SignupValidator,
  LoginValidator,
  UpdateValidator,
} from "../Validators/UserValidator";
import * as argon2 from "argon2";
import { CustomError } from "../Errors/CustomError";
import { EmailQueue } from "../Queues/Email.Queue";
import { EmailTokenUtils } from "../Utils/EmailTokenUtils";
import { sendEmailVerificationEmail } from "./Email.Service";
import { db } from "../Database";
import EmailVerificationRepo from "../Repositories/EmailVerificationRepo";
export const UserService = {
  signup: async (data: SignupValidator) => {
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
    const verificationToken =
      await EmailTokenUtils.generateEmailVerificationToken();
    const hashedVerificationToken =
      await EmailTokenUtils.hashEmailVerificationToken(verificationToken);
    const expirationMinuter =
      process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN || 15;
    const expiresAt = new Date(
      Date.now() + Number(expirationMinuter) * 60 * 1000,
    );
    const user = await db.transaction(async (tx) => {
      const createdUser = await UserRepo.create(tx, { ...data, passwordHash });
      await EmailVerificationRepo.create(tx, {
        userId: createdUser!.id,
        tokenHash: hashedVerificationToken,
        expiresAt,
      });
      return createdUser;
    });
    await EmailQueue.add("verify-email", {
      email: user!.email,
      fullName: user!.fullName,
      verificationToken,
      expiresIn: (expiresAt.getTime() - Date.now()) / 1000,
    });
    return user;
  },
  login: async (data: LoginValidator) => {
    const user = await UserRepo.findByEmail(data.email);
    if (!user)
      throw new CustomError(401, "User does not exist", "USER_NOT_FOUND");
    const isMatch = await argon2.verify(user.passwordHash, data.password);
    if (!isMatch)
      throw new CustomError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    return user;
  },
  update: async (data: UpdateValidator) => {
    const user = await UserRepo.update(
      "ec047760-4c16-436c-9a80-17e994a74175",
      data,
    );
    return user;
  },
};
