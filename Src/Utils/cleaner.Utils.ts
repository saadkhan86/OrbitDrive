import { users } from "../Database/Schemas/users.Schema";

export const cleanerUtils = {
    user: (user: typeof users.$inferSelect) => {
        const { id, fullName, email, isEmailVerified, createdAt, updatedAt } = user;
        return { id, fullName, email, isEmailVerified, createdAt, updatedAt };
    }
}