const RESEND_API_URL = "https://api.resend.com/emails";

export const sendCustomerVerificationOtp = async (email, otp) => {
  // Never call an external email provider from Jest.
  if (process.env.NODE_ENV === "test") {
    global.__TEST_VERIFICATION_OTPS__ ??= {};
    global.__TEST_VERIFICATION_OTPS__[email] = otp;
    return true;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error(
      "Email configuration is missing: RESEND_API_KEY / RESEND_FROM_EMAIL"
    );
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Madan Gold - Email Verification OTP",
      text: `Your Madan Gold verification OTP is: ${otp}. This OTP is valid for 10 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
          <h2>Madan Gold - Email Verification</h2>
          <p>Your verification OTP is:</p>
          <div style="font-size:32px;font-weight:700;letter-spacing:8px;margin:20px 0">
            ${otp}
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not create a Madan Gold account, please ignore this email.</p>
        </div>
      `,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("[EMAIL] Resend API FAILED:", {
      status: response.status,
      message: payload?.message || "Unknown email provider error",
      name: payload?.name,
    });

    throw new Error(
      payload?.message || "Email provider rejected the request."
    );
  }

  console.log("[EMAIL] Verification OTP sent successfully:", {
    to: email,
    id: payload?.id,
  });

  return true;
};
