export declare namespace IEmail {
  interface EmailVerificationJob {
    email: string;
    verificationToken: string;
    expiresIn: number;
    fullName: string;
  }
}
