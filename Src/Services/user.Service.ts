import UserRepo from "../Repositories/User.Repo";
import type { updateValidator } from "../Validators/user.Validator";
import * as argon2 from "argon2";
export const userService = {
  update: async (userId: string, data: updateValidator) => {
    let newData: Record<string, string> = {};
    if (data.password && data.password !== undefined)
      newData.passwordHash = await argon2.hash(data.password!);
    if (data.fullName && data.fullName !== undefined)
      newData.fullName = data.fullName;
    const user = await UserRepo.update(userId, { ...newData });
    return user;
  },
};
