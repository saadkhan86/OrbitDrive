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

export const UserService = {
  signup: async (data: SignupValidator) => {
    const isExist = await UserRepo.findByEmail(data.email);
    if (isExist)
      throw new CustomError(409, "User already exists", "USER_ALREADY_EXISTS");
    const passwordHash = await argon2.hash(data.password);
    const user = await UserRepo.create({ ...data, passwordHash });
    const emailVerificationToken =
      await EmailTokenUtils.generateEmailVerificationToken();
    const emailVerificationHashedToken =
      await EmailTokenUtils.hashEmailVerificationToken(emailVerificationToken);
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
