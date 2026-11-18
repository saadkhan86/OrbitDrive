
import { getTableColumns } from "drizzle-orm";
import { users } from "../../Database/schemas/users.Schema";

const { provider, pid, isEmailVerified, refreshToken, passwordHash, updatedAt, ...userRefColumns } = getTableColumns(users)
export default userRefColumns