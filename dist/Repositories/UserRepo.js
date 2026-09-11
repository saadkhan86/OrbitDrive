"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_Schema_1 = require("../Database/Schemas/users.Schema");
const drizzle_orm_1 = require("drizzle-orm");
const Database_1 = require("../Database");
class UserRepo {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Database_1.db
                .select()
                .from(users_Schema_1.users)
                .where((0, drizzle_orm_1.eq)(users_Schema_1.users.email, email))
                .limit(1);
            return user[0];
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Database_1.db.select().from(users_Schema_1.users).where((0, drizzle_orm_1.eq)(users_Schema_1.users.id, id)).limit(1);
            return user[0];
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Database_1.db
                .insert(users_Schema_1.users)
                .values({
                fullName: data.fullName,
                email: data.email,
                passwordHash: data.passwordHash,
            })
                .returning({
                id: users_Schema_1.users.id,
                fullName: users_Schema_1.users.fullName,
                email: users_Schema_1.users.email,
                isEmailVerified: users_Schema_1.users.isEmailVerified,
                createdAt: users_Schema_1.users.createdAt,
            });
            return result[0];
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Database_1.db
                .update(users_Schema_1.users)
                .set({ fullName: data.fullName })
                .where((0, drizzle_orm_1.eq)(users_Schema_1.users.id, id))
                .returning({
                id: users_Schema_1.users.id,
                fullName: users_Schema_1.users.fullName,
                email: users_Schema_1.users.email,
                updatedAt: users_Schema_1.users.updatedAt,
            });
            console.log(user);
            return user[0];
        });
    }
}
exports.default = new UserRepo();
//# sourceMappingURL=UserRepo.js.map