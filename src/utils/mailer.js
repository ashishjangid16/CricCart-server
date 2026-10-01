import nodemailer from "nodemailer";

export const isMailConfigured = () => Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
);

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  if (!isMailConfigured()) throw new Error("SMTP is not configured");

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Reset your CricCart password",
    text: `Use this link to reset your CricCart password. It expires in one hour: ${resetUrl}`,
    html: `<p>We received a request to reset your CricCart password.</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in one hour. If you did not request this, you can ignore this email.</p>`,
  });
};