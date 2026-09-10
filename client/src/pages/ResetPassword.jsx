import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { resetCustomerPassword } from "../api/auth.api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetCustomerPassword(
        token,
        password
      );

      setMessage(
        "Password reset successfully. Please login."
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-bold">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          minLength={6}
          maxLength={20}
          required
          className="mt-6 w-full rounded-xl border p-4"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) =>
            setConfirm(e.target.value)
          }
          minLength={6}
          maxLength={20}
          required
          className="mt-4 w-full rounded-xl border p-4"
        />

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-4 text-sm text-green-600">
            {message}
          </p>
        )}

        <button
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-black py-4 text-white"
        >
          {loading
            ? "Resetting..."
            : "Reset Password"}
        </button>
      </form>
    </div>
  );
}