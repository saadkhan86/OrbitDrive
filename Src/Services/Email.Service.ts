import transporter from "../Config/Transporter.Config";
import { Constants } from "../Constants/Constants";

export const EmailService = {
  sendEmailVerificationEmail: async function sendEmailVerificationEmail(
    email: string,
    verificationToken: string,
    expiresIn: number,
    fullName: string,
  ) {
    const verificationUrl = `${process.env.VERIFICATION_URL}/verification/email/${verificationToken}`;

    const minutes = Math.round(expiresIn);

    const content = Constants.emailVerification;

    await transporter.sendMail({
      from: `"Orbit Drive" <${process.env.EMAIL_USER}>`,
      to: email,

      subject: content.subject(fullName),

      text: content.text(verificationUrl, minutes),

      html: content.html(verificationUrl, minutes),
    });
  },
  sendPasswordResetEmail: async function sendPasswordResetEmail(
    email: string,
    verificationToken: string,
    expiresIn: number,
    fullName: string,
  ) {
    const verificationUrl = `${process.env.VERIFICATION_URL}/auth/password-reset/${verificationToken}`;

    const minutes = Math.round(expiresIn);

    const content = Constants.passwordReset;

    await transporter.sendMail({
      from: `"Orbit Drive" <${process.env.EMAIL_USER}>`,
      to: email,

      subject: content.subject(fullName),

      text: content.text(verificationUrl, minutes),

      html: content.html(verificationUrl, minutes),
    });
  },
  sendOrganizationInvitationEmail:
    async function sendOrganizationInvitationEmail(
      email: string,
      verificationToken: string,
      expiresIn: number,
      organizationName: string,
      role: "ADMIN" | "MEMBER" | "VIEWER",
    ) {
      const invitationUrl = `${process.env.VERIFICATION_URL}/invitations/${verificationToken}`;

      const hours = Math.round(expiresIn);

      const content = Constants.organizationInvitation;

      await transporter.sendMail({
        from: `"Orbit Drive" <${process.env.EMAIL_USER}>`,
        to: email,

        subject: content.subject(organizationName),

        text: content.text(organizationName, invitationUrl, role, hours),

        html: content.html(organizationName, invitationUrl, role, hours),
      });
    },
};
