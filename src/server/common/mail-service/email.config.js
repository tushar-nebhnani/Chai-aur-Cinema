import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use SendGrid, AWS SES, etc. later
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use a Gmail App Password!
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Service Error:", error.message);
  } else {
    console.log("✅ Email Service is ready to send messages");
  }
});

export default transporter;
