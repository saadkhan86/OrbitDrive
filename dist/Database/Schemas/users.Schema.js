"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    fullName: (0, pg_core_1.varchar)("fullName", { length: 50 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 50 }).notNull().unique(),
    passwordHash: (0, pg_core_1.varchar)("passwordHash", { length: 255 }).notNull(),
    isEmailVerified: (0, pg_core_1.boolean)("isEmailVerified").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").defaultNow().notNull(),
});
//# sourceMappingURL=users.Schema.js.map