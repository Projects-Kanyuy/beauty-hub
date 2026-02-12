const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, link) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`DEV MODE: Verification email to ${email}`);
    console.log(`Click this link to verify: ${link}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: `"Beauty Hub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <h2>Email Verification</h2>
      <p>Click below to verify your account:</p>
      <a href="${link}" style="background:#000;color:#fff;padding:10px 15px;border-radius:5px;text-decoration:none;">
         Verify Email
      </a>
      <p>If button doesn't work, copy and paste this URL:</p>
      <p>${link}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
