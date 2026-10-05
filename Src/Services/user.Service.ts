import UserRepo from "../Repositories/User.Repo";
import { VAuth } from "../Validators/auth.Validator";
import * as argon2 from "argon2";
export const userService = {
  me: async (userId: string) => {
    return UserRepo.findById({ userId });
  },
  update: async (userId: string, data: VAuth.update) => {
    let newData: Record<string, string> = {};
    if (data.password && data.password !== undefined)
      newData.passwordHash = await argon2.hash(data.password!);
    if (data.fullName && data.fullName !== undefined)
      newData.fullName = data.fullName;
    const user = await UserRepo.update({ userId }, { ...newData });
    return user;
  },
};
