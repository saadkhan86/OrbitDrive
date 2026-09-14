import UserRepo from "../Repositories/User.Repo";
import type { updateValidator } from "../Validators/user.Validator";
export const userService = {
  update: async (userId: string, data: updateValidator) => {
    const user = await UserRepo.update(userId, data);
    return user;
  },
};
