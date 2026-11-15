export type EmailJobData = {
  "verify-email": {
    email: string;
    verificationToken: string;
    expiresIn: number;
    fullName: string;
  };

  "password-reset": {
    email: string;
    verificationToken: string;
    expiresIn: number;
    fullName: string;
  };

  "organization-invitation": {
    email: string;
    verificationToken: string;
    expiresIn: number;
    organizationName: string;
    role: any;
  };
};

export type EmailJobName = keyof EmailJobData;
