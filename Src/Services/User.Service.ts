import UserRepo from "../Repositories/UserRepo";
import type {
  SignupValidator,
  LoginValidator,
} from "../Validators/UserValidator";
import * as argon2 from "argon2";
import { CustomError } from "../Errors/CustomError";

export const UserService = {
  signup: async (data: SignupValidator) => {
    const isExist = await UserRepo.findByEmail(data.email);
    if (isExist)
      throw new CustomError(409, "User already exists", "USER_ALREADY_EXISTS");
    const passwordHash = await argon2.hash(data.password);
    const user = await UserRepo.create({ ...data, passwordHash });
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
};
