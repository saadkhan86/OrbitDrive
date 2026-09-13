export const Constants = {
  emailVerificationTokenExpirationMinutes:
    Number(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN) || 15,
};
