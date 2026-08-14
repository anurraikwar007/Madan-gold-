import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const result = await adminLogin(
        formData.email,
        formData.password
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate("/admin", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to login as admin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8fa] via-[#fdeef3] to-[#f8dce5] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <div className="bg-white/90 backdrop-blur-xl border border-[#f3ccd8] rounded-[32px] shadow-[0_25px_80px_rgba(180,80,110,0.15)] p-8 md:p-10">

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#fbe0e8] flex items-center justify-center text-[#b85c7a]">
              <ShieldCheck size={32} />
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-[#b85c7a] uppercase tracking-[0.35em] text-xs font-semibold">
              Madan Gold
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold text-[#3d2630] mt-3">
              Admin Portal
            </h1>

            <p className="text-[#8d6d78] text-sm mt-2">
              Sign in to manage your store
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl bg-[#fff0f3] border border-[#f4c4d1] px-4 py-3 text-sm text-[#b04463]">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="block text-sm font-medium text-[#5d414b] mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full rounded-2xl border border-[#eccbd5] bg-[#fffafb] px-4 py-3.5 outline-none focus:border-[#c76b88] focus:ring-4 focus:ring-[#f8dce5]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5d414b] mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-2xl border border-[#eccbd5] bg-[#fffafb] px-4 py-3.5 pr-12 outline-none focus:border-[#c76b88] focus:ring-4 focus:ring-[#f8dce5]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a77a88]"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#b85c7a] hover:bg-[#a94d6b] text-white py-3.5 font-semibold transition disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

        </div>

        <p className="text-center text-xs text-[#9b7582] mt-5">
          Madan Gold • Secure Admin Access
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;