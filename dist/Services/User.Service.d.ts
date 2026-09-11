import type { SignupValidator, LoginValidator, UpdateValidator } from "../Validators/UserValidator";
import type { JWTUtils } from "../Utils/JWTUtils";
export declare const UserService: {
    signup: (data: SignupValidator, JWTUtils: JWTUtils) => Promise<{
        id: string;
        fullName: string;
        email: string;
        isEmailVerified: boolean;
        createdAt: Date;
    } | undefined>;
    login: (data: LoginValidator) => Promise<{
        id: string;
        fullName: string;
        email: string;
        passwordHash: string;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update: (data: UpdateValidator) => Promise<{
        id: string;
        fullName: string;
        email: string;
        updatedAt: Date;
    } | undefined>;
};
//# sourceMappingURL=User.Service.d.ts.map