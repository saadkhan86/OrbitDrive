export const Constants = {
  tokenExpireTime: Number(process.env.TOKEN_EXPIRE_TIME) || 15,
  emailVerification: {
    subject: (fullName: string) => `${fullName} | Verify your OrbitDrive email`,

    text: (verificationUrl: string, minutes: number) => `
Please verify your email by clicking this link:

${verificationUrl}

This verification link will expire in ${minutes} minutes.

If you did not create this account, you can safely ignore this email.
    `,

    html: (verificationUrl: string, minutes: number) => `
      <div>
        <h2>Welcome to OrbitDrive!</h2>

        <p>
          Please verify your email address to activate your account.
        </p>

        <p>
          This verification link will expire in
          <strong>${minutes} minutes</strong>.
        </p>

        <div style="text-align: center; margin: 25px 25px 25px 0px;">
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #000000;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 600;
            "
          >
            Verify Email
          </a>
        </div>

        <p>
          If you did not create this account, you can safely ignore this email.
        </p>
      </div>
    `,
  },

  passwordReset: {
    subject: (fullName: string) =>
      `${fullName} | Reset your OrbitDrive password`,

    text: (verificationUrl: string, minutes: number) => `
We received a request to reset your OrbitDrive password.

Reset your password by clicking this link:

${verificationUrl}

This password reset link will expire in ${minutes} minutes.

If you did not request a password reset, you can safely ignore this email.
    `,

    html: (verificationUrl: string, minutes: number) => `
      <div>
        <h2>Password Reset Request</h2>

        <p>
          We received a request to reset your OrbitDrive password.
        </p>

        <p>
          Click the button below to set a new password.
        </p>

        <div style="text-align: center; margin: 25px 25px 25px 0px;">
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #000000;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 600;
            "
          >
            Reset Password
          </a>
        </div>

        <p>
          This password reset link will expire in
          <strong>${minutes} minutes</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  },
  organizationInvitation: {
    subject: (organizationName: string) =>
      `You're invited to join ${organizationName} on OrbitDrive`,

    text: (
      organizationName: string,
      invitationUrl: string,
      role: string,
      hours: number,
    ) => `
You have been invited to join ${organizationName} on OrbitDrive.

Your assigned role will be: ${role}

Accept the invitation by clicking this link:

${invitationUrl}

This invitation will expire in ${hours} hours.

If you were not expecting this invitation, you can safely ignore this email.
  `,

    html: (
      organizationName: string,
      invitationUrl: string,
      role: string,
      hours: number,
    ) => `
    <div>
      <h2>You're Invited to Join ${organizationName}</h2>

      <p>
        You have been invited to join
        <strong>${organizationName}</strong>
        on OrbitDrive.
      </p>

      <p>
        Your assigned role will be:
        <strong>${role}</strong>
      </p>

      <div style="text-align: center; margin: 25px 25px 25px 0px;">
        <a
          href="${invitationUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #000000;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
          "
        >
          Accept Invitation
        </a>
      </div>

      <p>
        This invitation will expire in
        <strong>${hours} hours</strong>.
      </p>

      <p>
        If you were not expecting this invitation,
        you can safely ignore this email.
      </p>
    </div>
  `,
  },
};
