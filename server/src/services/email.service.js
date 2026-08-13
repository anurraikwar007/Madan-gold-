import nodemailer from "nodemailer";

const getTransporter = () => {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Gmail email configuration is missing."
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

export const sendCustomerVerificationOtp = async (
  email,
  otp
) => {
  // ============================================
  // TEST ENVIRONMENT
  // ============================================

  if (process.env.NODE_ENV === "test") {
    global.__TEST_VERIFICATION_OTPS__ ??= {};

    global.__TEST_VERIFICATION_OTPS__[email] = otp;

    return true;
  }

  // ============================================
  // PRODUCTION
  // ============================================

  const transporter = getTransporter();

  // Verify SMTP connection before sending
  try {
  await transporter.verify();

  console.log("[EMAIL] Gmail SMTP connection successful");
  console.log("[EMAIL] MAIL_USER:", process.env.MAIL_USER);

} catch (error) {
  console.error("[EMAIL] Gmail SMTP connection FAILED:", {
    message: error.message,
    code: error.code,
    response: error.response,
    responseCode: error.responseCode,
    command: error.command,
  });

  throw error;
}

  return true;
};