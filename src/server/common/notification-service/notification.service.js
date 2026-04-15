import EmailTemplates from "./notifications.templates.js";
import transporter from "./notification.config.js";

class NotificationService {
  static async #sendMail({ to, subject, html }) {
    try {
      const mailOptions = {
        from: '"ChaiaurCinema" <noreply@bookmyshowclone.com>',
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
  }

  static async sendVerifyEmail(toEmail, name, rawToken) {
    return await this.#sendMail({
      to: toEmail,
      subject: "Action Required: Verify Your Email",
      // Notice how clean this is! The template handles the URL internally now.
      html: EmailTemplates.verifyEmail(name, rawToken),
    });
  }

  static async sendWelcome(toEmail, name) {
    return await this.#sendMail({
      to: toEmail,
      subject: "Welcome to BookMyShow Clone! 🎬",
      html: EmailTemplates.register(name),
    });
  }

  static async sendPasswordReset(toEmail, rawToken) {
    return await this.#sendMail({
      to: toEmail,
      subject: "Password Reset Request",
      html: EmailTemplates.resetPassword(rawToken),
    });
  }

  static async sendChangedPassword(toEmail, name) {
    return await this.#sendMail({
      to: toEmail,
      subject: "Security Alert: Password Changed Successfully",
      html: EmailTemplates.changedPassword(name),
    });
  }

  static async sendLoginAlert(toEmail, name) {
    // We generate the time exactly when the email is sent
    const time = new Date().toISOString();

    return await this.#sendMail({
      to: toEmail,
      subject: "New Login Detected",
      html: EmailTemplates.login(name, time),
    });
  }

  static async sendLogoutAlert(toEmail, name) {
    // We generate the time exactly when the email is sent
    const time = new Date().toISOString();

    return await this.#sendMail({
      to: toEmail,
      subject: "New Logout Detected",
      html: EmailTemplates.logout(name, time),
    });
  }

  static async sendTicketsBooked(
    toEmail,
    movieTitle = "Dhurandhar- The Revenge",
    seats,
    time = Date.now(),
    amount,
  ) {
    return await this.#sendMail({
      to: toEmail,
      subject: `🎟️ Tickets Confirmed for ${movieTitle}!`,
      html: EmailTemplates.ticketsBooked(movieTitle, seats, time, amount),
    });
  }

  static async sendDeleteAccount(toEmail, name) {
    return await this.#sendMail({
      to: toEmail,
      subject: "Account Successfully Deleted",
      html: EmailTemplates.deleteAccount(name),
    });
  }
}

export default NotificationService;
