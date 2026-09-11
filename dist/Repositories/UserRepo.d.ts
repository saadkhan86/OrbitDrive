import { UpdateValidator } from "../Validators/UserValidator";
declare class UserRepo {
    findByEmail(email: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        passwordHash: string;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
    findById(id: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        passwordHash: string;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
    create(data: {
        fullName: string;
        email: string;
        passwordHash: string;
    }): Promise<{
        id: string;
        fullName: string;
        email: string;
        isEmailVerified: boolean;
        createdAt: Date;
    } | undefined>;
    update(id: string, data: UpdateValidator): Promise<{
        id: string;
        fullName: string;
        email: string;
        updatedAt: Date;
    } | undefined>;
}
declare const _default: UserRepo;
export default _default;
//# sourceMappingURL=UserRepo.d.ts.map