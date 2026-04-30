const nodemailer = require("nodemailer");

const hasSmtpConfig = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT);

const createTransporter = () => {
  if (!hasSmtpConfig()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure:
      process.env.SMTP_SECURE === "true" ||
      Number(process.env.SMTP_PORT) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();
  const from =
    process.env.MAIL_FROM ||
    process.env.SMTP_USER ||
    "MinoStore <no-reply@minostore.local>";

  if (!transporter) {
    console.warn("SMTP non configure. Email non envoye:", {
      to,
      subject,
      text,
    });
    return { skipped: true };
  }

  return transporter.sendMail({ from, to, subject, text, html });
};

module.exports = sendEmail;
