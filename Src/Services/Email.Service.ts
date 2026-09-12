import transporter from "../Config/Transporter.Config";

export async function sendEmailVerificationEmail(
  email: string,
  verificationToken: string,
  expiresIn: number,
  fullName: string,
) {
  const verificationUrl = `${process.env.BACKEND_URL}/api/v1/user/verify-email/${verificationToken}`;

  await transporter.sendMail({
    from: `"OrbitDrive" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${fullName} | Verify your OrbitDrive email`,

    text: `
Please verify your email by clicking this link:

${verificationUrl}

This verification link will expire in ${expiresIn} minutes.
    `,

    html: `
      <div>
        <h2>Welcome to OrbitDrive!</h2>

        <p>
          Please verify your email address to activate your account.
        </p>

        <p>
          This verification link will expire in
          <strong>${expiresIn} minutes</strong>.
        </p>
        <div style="text-align: center; margin: 25px 0;">
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
  });
}
