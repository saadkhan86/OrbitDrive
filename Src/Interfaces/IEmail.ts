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
}
