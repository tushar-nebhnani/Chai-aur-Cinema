const baseTemplate = (title, content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #F84464; padding: 20px; text-align: center; color: white;">
      <h1 style="margin: 0;">BookMyShow Clone</h1>
    </div>
    <div style="padding: 20px; color: #333;">
      <h2 style="color: #F84464;">${title}</h2>
      ${content}
    </div>
    <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #888;">
      <p>&copy; ${new Date().getFullYear()} BookMyShow Clone. All rights reserved.</p>
    </div>
  </div>
`;

const templates = {
  // 1. REGISTER
  register: (name) =>
    baseTemplate(
      "Welcome to the Movies!",
      `<p>Hi ${name},</p>
       <p>Your account has been successfully created. We are thrilled to have you onboard!</p>
       <p>Grab your popcorn and book your first ticket today.</p>
       <a href="http://localhost:3000/movies" style="display: inline-block; padding: 10px 20px; background-color: #F84464; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Browse Movies</a>`,
    ),

  // 2. LOGIN (Recommended only for new devices/IPs)
  login: (name, time) =>
    baseTemplate(
      "Security Alert: New Login",
      `<p>Hi ${name},</p>
       <p>We noticed a new login to your BookMyShow Clone account.</p>
       <p><strong>Time:</strong> ${new Date(time).toLocaleString()}</p>
       <p style="font-size: 12px; color: #999; margin-top: 20px;">If this was you, you can safely ignore this email. If not, please reset your password immediately.</p>`,
    ),

  // 3. LOGOUT
  logout: (name) =>
    baseTemplate(
      "Session Terminated",
      `<p>Hi ${name},</p>
       <p>You have successfully logged out of your account.</p>
       <p>We hope you had a great time. See you at the movies soon!</p>`,
    ),

  // 4. TICKETS BOOKED
  ticketsBooked: (movieTitle, seats, time, amount) =>
    baseTemplate(
      "🎟️ Booking Confirmed!",
      `<p>Your tickets are locked in! Get ready for <strong>${movieTitle}</strong>.</p>
       <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
         <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(time).toLocaleString()}</td></tr>
         <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Seats:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${seats}</td></tr>
         <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Total Amount:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${amount}</td></tr>
       </table>
       <p style="text-align: center; font-size: 14px;">Show this email at the entrance. Enjoy the show!</p>`,
    ),

  // 5. RESET PASSWORD (The secure token link)
  resetPassword: (token) =>
    baseTemplate(
      "Password Reset Request",
      `<p>You requested a password reset. Click the button below to securely choose a new password.</p>
       <div style="text-align: center;">
         <a href="http://localhost:3000/reset-password?token=${token}" 
            style="display: inline-block; padding: 12px 24px; background-color: #F84464; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">
            Reset Password
         </a>
       </div>
       <p style="font-size: 12px; color: #999; margin-top: 25px;">This link is valid for 15 minutes. If you didn't request this, safely ignore this email.</p>`,
    ),

  // 6. CHANGED PASSWORD (Confirmation after the reset)
  changedPassword: (name) =>
    baseTemplate(
      "Password Successfully Updated",
      `<p>Hi ${name},</p>
       <p>Your password has been successfully changed.</p>
       <p>If you performed this action, no further action is needed. If you did not make this change, please contact our support team immediately.</p>`,
    ),

  // 7. DELETE ACCOUNT
  deleteAccount: (name) =>
    baseTemplate(
      "Account Deleted",
      `<p>Hi ${name},</p>
       <p>We're sad to see you go! Your BookMyShow Clone account has been completely deleted, along with all your data.</p>
       <p>If you ever want to catch a movie with us again, you can always create a new account.</p>
       <p>Take care!</p>`,
    ),
};

export default templates;
