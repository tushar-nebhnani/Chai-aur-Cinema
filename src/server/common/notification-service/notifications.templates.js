import "dotenv/config"; // Crucial for reading process.env.CLIENT_URL

class EmailTemplates {
  static primaryColor = "#F84464"; // The BookMyShow Red
  static textColor = "#333333";
  static lightGray = "#f1f5f9";

  static get clientUrl() {
    return process.env.CLIENT_URL || "http://localhost:3000";
  }

  static #baseTemplate(
    title,
    content,
    previewText = "Notification from BookMyShow Clone",
  ) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <span style="display: none; font-size: 1px; color: transparent; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
          ${previewText}
        </span>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                
                <tr>
                  <td style="background-color: ${this.primaryColor}; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 0.5px;">🎬 BookMyShow</h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px 35px; color: ${this.textColor}; font-size: 16px; line-height: 1.6;">
                    <h2 style="color: ${this.primaryColor}; margin-top: 0; margin-bottom: 20px; font-size: 22px;">${title}</h2>
                    ${content}
                  </td>
                </tr>
                
                <tr>
                  <td style="background-color: ${this.lightGray}; padding: 25px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} BookMyShow Clone. All rights reserved.</p>
                    <p style="margin: 8px 0 0 0;">Designed with logic & engineered for performance.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  // 1. Verify Email (Triggered on Registration)
  static verifyEmail(name, token) {
    return this.#baseTemplate(
      "Verify Your Email",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Welcome to BookMyShow Clone! Before you can start booking tickets, we just need to verify your email address.</p>
       <table width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
         <tr>
           <td align="center">
             <a href="${this.clientUrl}/verify-email?token=${token}" 
                style="display: inline-block; padding: 14px 30px; background-color: ${this.primaryColor}; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px;">
                Verify My Account
             </a>
           </td>
         </tr>
       </table>
       <p style="font-size: 13px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">If you did not create an account using this email address, you can safely ignore this message.</p>`,
      "Action Required: Verify your BookMyShow Clone account email.",
    );
  }

  // 2. Welcome/Register (Triggered after successful verification)
  static register(name) {
    return this.#baseTemplate(
      "Welcome to the Movies!",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Your account has been successfully verified and activated. We are thrilled to have you onboard!</p>
       <p>Grab your popcorn, pick your favorite seat, and book your first ticket today.</p>
       <table width="100%" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
         <tr>
           <td align="center">
             <a href="${this.clientUrl}/movies" 
                style="display: inline-block; padding: 14px 30px; background-color: ${this.primaryColor}; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Browse Now Showing
             </a>
           </td>
         </tr>
       </table>`,
      "Your BookMyShow Clone account is fully activated!",
    );
  }

  // 3. New Login Alert (Triggered on sign-in)
  static login(name, time) {
    return this.#baseTemplate(
      "Security Alert: New Login",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>We noticed a new login to your BookMyShow Clone account.</p>
       <div style="background-color: ${this.lightGray}; padding: 15px; border-radius: 6px; margin: 20px 0;">
         <p style="margin: 0; font-family: monospace; font-size: 14px;"><strong>Time:</strong> ${new Date(time).toLocaleString()}</p>
       </div>
       <p style="font-size: 13px; color: #94a3b8; margin-top: 20px;">If this was you, you can safely ignore this email. If you do not recognize this activity, please reset your password immediately.</p>`,
      "New login detected on your account.",
    );
  }

  // 4. Reset Password (Triggered when user forgets password)
  static resetPassword(token) {
    return this.#baseTemplate(
      "Password Reset Request",
      `<p>You recently requested to reset your password for your BookMyShow Clone account. Click the button below to securely choose a new password.</p>
       <table width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
         <tr>
           <td align="center">
             <a href="${this.clientUrl}/reset-password?token=${token}" 
                style="display: inline-block; padding: 14px 30px; background-color: ${this.primaryColor}; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reset Password
             </a>
           </td>
         </tr>
       </table>
       <p style="font-size: 13px; color: #ef4444; margin-top: 20px; font-weight: bold;">This link will expire in 15 minutes.</p>
       <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">If you did not request a password reset, please safely ignore this email or contact support if you have concerns.</p>`,
      "Action Required: Reset your password.",
    );
  }

  // 5. Changed Password Confirmation (Triggered after successful reset or manual change)
  static changedPassword(name) {
    return this.#baseTemplate(
      "Password Successfully Updated",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>The password for your BookMyShow Clone account was recently changed.</p>
       <p>If you performed this action, no further action is needed.</p>
       <p style="font-size: 13px; color: #94a3b8; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px;">If you did not make this change, please contact our support team immediately to secure your account.</p>`,
      "Your account password has been updated.",
    );
  }

  // 6. Tickets Booked (Triggered after successful payment/booking checkout)
  static ticketsBooked(movieTitle, seats, time, amount) {
    return this.#baseTemplate(
      "🎟️ Booking Confirmed!",
      `<p>Your tickets are locked in! Get ready for <strong>${movieTitle}</strong>.</p>
       
       <div style="background-color: ${this.lightGray}; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
         <table style="width: 100%; border-collapse: collapse;">
           <tr>
             <td style="padding: 10px 0; border-bottom: 1px solid #cbd5e1; color: #64748b;">Showtime</td>
             <td style="padding: 10px 0; border-bottom: 1px solid #cbd5e1; font-weight: bold; text-align: right;">${new Date(time).toLocaleString()}</td>
           </tr>
           <tr>
             <td style="padding: 10px 0; border-bottom: 1px solid #cbd5e1; color: #64748b;">Seats</td>
             <td style="padding: 10px 0; border-bottom: 1px solid #cbd5e1; font-weight: bold; text-align: right;">${seats}</td>
           </tr>
           <tr>
             <td style="padding: 10px 0; color: #64748b;">Total Amount</td>
             <td style="padding: 10px 0; font-weight: bold; text-align: right; color: ${this.primaryColor}; font-size: 18px;">₹${amount}</td>
           </tr>
         </table>
       </div>
       
       <p style="text-align: center; font-size: 15px; font-weight: bold;">Show this email at the entrance. Enjoy the show!</p>`,
      `Your tickets for ${movieTitle} are confirmed!`,
    );
  }

  // 7. Delete Account (Triggered when user deletes profile)
  static deleteAccount(name) {
    return this.#baseTemplate(
      "Account Deleted",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>We're sad to see you go! Your BookMyShow Clone account has been completely deleted, along with all your data.</p>
       <p>If you ever want to catch a movie with us again, you can always create a new account.</p>
       <p>Take care!</p>`,
      "Your account has been successfully deleted.",
    );
  }

  static logout(name) {
    return this.#baseTemplate(
      "Successful Logout",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>You have successfully logged out of your BookMyShow Clone account on this device.</p>
       <p>If you just finished booking tickets, we hope you enjoy the show! You can always log back in whenever you are ready to browse more movies.</p>
       <p style="font-size: 13px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">If you did not perform this logout and suspect someone else might be using your account, please log back in and change your password immediately.</p>`,
      "You have been successfully logged out of your account.",
    );
  }
}

export default EmailTemplates;
