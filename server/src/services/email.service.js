import nodemailer from "nodemailer";

const getTransporter = () => {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "MAIL_USER or MAIL_PASSWORD is missing."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
};

// ======================================================
// Verify SMTP Connection
// ======================================================

export const verifyEmailTransporter = async () => {
  const transporter = getTransporter();

  await transporter.verify();

  console.log(
    "[EMAIL] Gmail SMTP connection verified successfully."
  );

  return true;
};

// ======================================================
// Customer Verification OTP
// ======================================================

export const sendCustomerVerificationOtp = async (
  email,
  otp
) => {
  // ====================================================
  // TEST
  // ====================================================

  if (process.env.NODE_ENV === "test") {
    global.__TEST_VERIFICATION_OTPS__ ??= {};

    global.__TEST_VERIFICATION_OTPS__[email] = otp;

    return true;
  }

  // ====================================================
  // PRODUCTION
  // ====================================================

  const transporter = getTransporter();

  const from =
    process.env.MAIL_FROM ||
    process.env.MAIL_USER;

  console.log(
    `[EMAIL] Sending verification OTP to ${email}`
  );

  const info = await transporter.sendMail({
    from: `"Madan Gold" <${from}>`,
    to: email,
    subject: "Madan Gold - Verify Your Email",

    text: `
Your Madan Gold verification OTP is: ${otp}

This OTP is valid for 10 minutes.

If you did not create this account, you can safely ignore this email.
`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
      ">

        <h2 style="color:#b76e79;">
          Madan Gold
        </h2>

        <p>
          Thank you for creating your Madan Gold account.
        </p>

        <p>
          Your email verification OTP is:
        </p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          padding:20px;
          text-align:center;
          background:#f8e8ec;
          border-radius:10px;
          margin:20px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for
          <strong>10 minutes</strong>.
        </p>

        <p>
          If you did not create this account,
          you can safely ignore this email.
        </p>

      </div>
    `,
  });

  console.log(
    `[EMAIL] Verification OTP sent successfully. MessageId: ${info.messageId}`
  );

  return info;
};