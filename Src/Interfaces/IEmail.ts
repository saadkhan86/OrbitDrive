export declare namespace IEmail {
  interface create {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }
  interface EmailVerificationJob {
    email: string;
    verificationToken: string;
    expiresIn: number;
    fullName: string;
  }
  interface update {
    id: string;
    tokenHash?: string | null;
    expiresAt?: Date | null;
    claimedAt?: Date | null;
  }
}
