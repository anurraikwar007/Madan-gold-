import nodemailer from "nodemailer";

const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Gmail email configuration is missing: EMAIL_USER / EMAIL_PASSWORD"
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

export const sendCustomerVerificationOtp = async (email, otp) => {
  // TEST ENVIRONMENT
  if (process.env.NODE_ENV === "test") {
    global.__TEST_VERIFICATION_OTPS__ ??= {};

    global.__TEST_VERIFICATION_OTPS__[email] = otp;

    return true;
  }

  const transporter = getTransporter();

  try {
    await transporter.verify();

    console.log("[EMAIL] Gmail SMTP connection successful");
    console.log("[EMAIL] Sending OTP to:", email);

    const info = await transporter.sendMail({
      from: `"Madan Gold" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Madan Gold - Email Verification OTP",
      text: `Your Madan Gold verification OTP is: ${otp}. This OTP is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Madan Gold - Email Verification</h2>
          <p>Your verification OTP is:</p>

          <h1 style="letter-spacing: 6px;">
            ${otp}
          </h1>

          <p>This OTP is valid for 10 minutes.</p>

          <p>If you did not create a Madan Gold account, please ignore this email.</p>
        </div>
      `,
    });

    console.log("[EMAIL] OTP email sent successfully");
    console.log("[EMAIL] Message ID:", info.messageId);

    return true;
  } catch (error) {
    console.error("[EMAIL] OTP sending FAILED:", {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command,
    });

    throw error;
  }
};