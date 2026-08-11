import nodemailer from "nodemailer";

const getTransporter = () => {
  if (
    !process.env.MAIL_USER ||
    !process.env.MAIL_PASSWORD
  ) {
    throw new Error(
      "Gmail email configuration is missing."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};

export const sendCustomerVerificationOtp = async (
  email,
  otp
) => {
  // Jest/test environment me actual Gmail call mat karo.
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from:
      process.env.MAIL_FROM ||
      process.env.MAIL_USER,

    to: email,

    subject:
      "Madan Gold - Verify Your Email",

    text: `Your Madan Gold verification OTP is ${otp}. This OTP is valid for 10 minutes.`,

    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#b76e79;">Madan Gold</h2>

        <p>Thank you for creating your Madan Gold account.</p>

        <p>Your email verification OTP is:</p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          padding:20px;
          text-align:center;
          background:#f8e8ec;
          border-radius:10px;
        ">
          ${otp}
        </div>

        <p>This OTP is valid for <strong>10 minutes</strong>.</p>

        <p>If you did not create this account, you can safely ignore this email.</p>
      </div>
    `,
  });
};