const RESEND_API_URL = "https://api.resend.com/emails";

export const sendCustomerVerificationOtp = async (email, otp) => {
  // Never call an external email provider from Jest.
 if (
  process.env.NODE_ENV === "test" ||
  process.env.JEST_WORKER_ID
 ) {
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

export const sendCustomerPasswordResetEmail = async (
  email,
  resetUrl
) => {
    if (
      process.env.NODE_ENV === "test" ||
      process.env.JEST_WORKER_ID
    ) {
      global.__TEST_PASSWORD_RESET_URLS__ ??= {};
      global.__TEST_PASSWORD_RESET_URLS__[email] = resetUrl;

      return true;
    }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error(
      "Email configuration is missing: RESEND_API_KEY / RESEND_FROM_EMAIL"
    );
  }

  const response = await fetch(
    RESEND_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject:
          "Madan Gold - Password Reset",
        text: `Reset your password using this link: ${resetUrl}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
            <h2>Madan Gold - Password Reset</h2>

            <p>
              We received a request to reset your password.
            </p>

            <p>
              Click the button below to reset your password.
            </p>

            <p style="margin:30px 0">
              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  padding:14px 22px;
                  background:#111;
                  color:#fff;
                  text-decoration:none;
                  border-radius:8px;
                "
              >
                Reset Password
              </a>
            </p>

            <p>
              This link is valid for 15 minutes.
            </p>

            <p>
              If you did not request this, please ignore this email.
            </p>
          </div>
        `,
      }),
    }
  );

  const payload =
    await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        "Email provider rejected the request."
    );
  }

  return true;
};
