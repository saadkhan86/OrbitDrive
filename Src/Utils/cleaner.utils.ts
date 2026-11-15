import { users } from "../Database/schemas/users.Schema";

export const cleanerUtils = {
    user: (user: typeof users.$inferSelect) => {
        const { id, fullName, email, isEmailVerified, profile, createdAt, updatedAt } = user;
        return { id, fullName, email, isEmailVerified, profile, createdAt, updatedAt };
    }
}