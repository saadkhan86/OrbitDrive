export declare namespace IEmail {
  interface create {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }
  interface update {
    id: string;
    tokenHash?: string | null;
    expiresAt?: Date | null;
    claimedAt?: Date | null;
  }
}
