import transporter from "../Config/Transporter.Config";
import { Constants } from "../Constants/Constants";

export async function sendEmailService(
  type: "email" | "password-reset" | "organization-invitation",
  email: string,
  verificationToken: string,
  expiresIn: number,
  fullName: string,
) {
  let verificationUrl;
  if (type == "password-reset") {
    verificationUrl = `${process.env.VERIFICATION_URL}/auth/${type}/${verificationToken}`;
  } else {
    verificationUrl = `${process.env.VERIFICATION_URL}/verification/${type}/${verificationToken}`;
  }
  const minutes = Math.round(expiresIn);
  let content;
  if (type === "password-reset") {
    content = Constants.passwordReset;
  } else {
    content = Constants.emailVerification;
  }
  await transporter.sendMail({
    from: `"Orbit Drive" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: content.subject(fullName),

    text: content.text(verificationUrl, minutes),

    html: content.html(verificationUrl, minutes),
  });
}
