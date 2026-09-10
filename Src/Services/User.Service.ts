import UserRepo from "../Repositories/UserRepo";
import type {
  SignupValidator,
  LoginValidator,
} from "../Validators/UserValidator";
import * as argon2 from "argon2";

export const UserService = {
  signup: async (data: SignupValidator) => {
    const isExist = await UserRepo.findByEmail(data.email);
    if (isExist) throw new Error("User already exists");
    const passwordHash = await argon2.hash(data.password);
    const user = await UserRepo.create({ ...data, passwordHash });
    return { message: "Signup Service", user };
  },
  login: async (data: LoginValidator) => {},
};
