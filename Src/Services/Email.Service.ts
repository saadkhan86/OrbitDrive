import transporter from "../Config/Transporter.Config";
import { Constants } from "../Constants/Constants";

export async function sendEmailService(
  type: "email-verification" | "password-reset",
  email: string,
  verificationToken: string,
  expiresIn: number,
  fullName: string,
) {
  const verificationUrl = `${process.env.VERIFICATION_URL}/${type}/${verificationToken}`;
  const minutes = Math.round(expiresIn);
  let content;
  if (type === "password-reset") {
    content = Constants.passwordReset;
  } else {
    content = Constants.emailVerification;
  }
  await transporter.sendMail({
    from: `"OrbitDrive" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: content.subject(fullName),

    text: content.text(verificationUrl, minutes),

    html: content.html(verificationUrl, minutes),
  });
}
