import UserRepo from "../Repositories/User.Repo";
import { VAuth } from "../Validators/auth.Validator";
import * as argon2 from "argon2";
import { VUser } from "../Validators/user.Validator";
export const userService = {
  me: async (user: VAuth.userId) => {
    return UserRepo.findById({ userId: user.userId });
  },
  update: async (user: VAuth.userId, data: VAuth.update) => {
    let newData: Record<string, string> = {};
    if (data.password && data.password !== undefined)
      newData.passwordHash = await argon2.hash(data.password!);
    if (data.fullName && data.fullName !== undefined)
      newData.fullName = data.fullName;
    const updatedUser = await UserRepo.update({ userId: user.userId, ...newData });
    return updatedUser;
  },
  logout: async (user: VAuth.userId) => {
    await UserRepo.logout(user)
    return true;
  }, query: async (search: VUser.query) => {
    const users = await UserRepo.query(search)
    return users;
  }

};
