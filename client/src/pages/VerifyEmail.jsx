import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:10000/api/v1";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    localStorage.getItem("verificationEmail") ||
    "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const inputsRef = useRef([]);

  // =========================
  // Timer
  // =========================

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // =========================
  // OTP Input
  // =========================

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");
    setMessage("");

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // =========================
  // Verify OTP
  // =========================

  const handleVerify = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (!email) {
      setError("Verification email is missing. Please signup again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/customers/verify-email`,
        {
          email,
          otp: enteredOtp,
        }
      );

      if (response.data?.success) {
        setMessage(
          response.data?.message ||
            "Email verified successfully."
        );

        localStorage.removeItem("verificationEmail");

        setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: {
              email,
              verified: true,
            },
          });
        }, 1200);
      } else {
        setError(
          response.data?.message ||
            "Invalid or expired OTP."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Resend OTP
  // =========================

  const handleResend = async () => {
    if (timer > 0 || resending) return;

    if (!email) {
      setError("Verification email is missing.");
      return;
    }

    try {
      setResending(true);
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/customers/resend-verification-otp`,
        {
          email,
        }
      );

      if (response.data?.success) {
        setMessage(
          response.data?.message ||
            "A new OTP has been sent to your email."
        );

        setOtp(["", "", "", "", "", ""]);
        setTimer(60);

        setTimeout(() => {
          inputsRef.current[0]?.focus();
        }, 100);
      } else {
        setError(
          response.data?.message ||
            "Unable to resend OTP."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  // =========================
  // No email
  // =========================

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-3">
            Verification Email Missing
          </h1>

          <p className="text-gray-600 mb-6">
            Please signup again to continue email verification.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 rounded-lg bg-black text-white"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8">

        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold">
            Verify Your Email
          </h1>

          <p className="text-gray-600 mt-2">
            We sent a 6-digit OTP to
          </p>

          <p className="font-medium mt-1 break-all">
            {email}
          </p>
        </div>

        <form onSubmit={handleVerify}>

          {/* OTP boxes */}

          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleOtpChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border rounded-lg outline-none focus:ring-2 focus:ring-black"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {/* Error */}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-600 px-4 py-3 text-sm text-center">
              {error}
            </div>
          )}

          {/* Success */}

          {message && (
            <div className="mb-4 rounded-lg bg-green-50 text-green-600 px-4 py-3 text-sm text-center">
              {message}
            </div>
          )}

          {/* Verify */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-black text-white font-medium disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Resend */}

        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-gray-500 text-sm">
              Resend OTP in{" "}
              <span className="font-semibold">
                {timer}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-medium underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-5 text-sm text-gray-500 hover:text-black"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;