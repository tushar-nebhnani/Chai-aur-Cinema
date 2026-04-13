import templates from "./email.templates.js";
import transporter from "./email.config.js";

const sendMail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: '"Your App Name" <noreply@yourapp.com>',
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent to ${to} [ID: ${info.messageId}]`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
    return false;
  }
};

export const registerEmail = async (toEmail, name) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:4000";

  return await sendMail({
    to: toEmail,
    subject: "Account succesfully created.",
    html: templates.welcome(baseUrl),
  });
};

export const sendPasswordResetMail = async (toEmail, rawToken) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:4000";
  const resetUrl = `${baseUrl}/api/auth/change-password?token=${rawToken}`;

  return await sendMail({
    to: toEmail,
    subject: "Password Reset Request",
    html: templates.passwordReset(resetUrl),
  });
};

export const sendChangePasswordMail = async (toEmail, name) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:4000";
  const resetUrl = `${baseUrl}/api/auth/change-password?token=${rawToken}`;

  return await sendMail({
    to: toEmail,
    subject: "Password Changed Successfully.",
    html: templates.passwordReset(resetUrl),
  });
};

export const sendVerificationMail = async (toEmail, rawToken) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:4000";
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${rawToken}`;

  return await sendMail({
    to: toEmail,
    subject: "Please Verify Your Email",
    html: templates.verification(verificationUrl),
  });
};

export const sendLoginAlertMail = async (toEmail, deviceInfo) => {
  const time = new Date().toLocaleString();

  return await sendMail({
    to: toEmail,
    subject: "New Login Detected",
    html: templates.loginAlert(deviceInfo, time),
  });
};

export const sendLogoutMail = async (toEmail) => {
  return await sendMail({
    to: toEmail,
    subject: "Successful Logout",
    html: templates.logoutAlert(),
  });
};
