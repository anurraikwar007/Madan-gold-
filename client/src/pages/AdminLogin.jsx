import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();

  const { adminLogin } =
    useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result =
        await adminLogin(
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
        "Admin login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#FAF9F6]">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-xl">

        <div className="text-center mb-8">
          <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs">
            Madan Gold
          </p>

          <h1 className="text-4xl font-bold mt-4">
            Admin Login
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="text-sm mb-2 block">
              Admin Email
            </label>

            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              className="w-full h-14 px-5 rounded-2xl border border-black/10 bg-[#FAF9F6]"
            />
          </div>

          <div>
            <label className="text-sm mb-2 block">
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
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                className="w-full h-14 px-5 pr-12 rounded-2xl border border-black/10 bg-[#FAF9F6]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-black text-white font-medium hover:bg-[#D4AF37] hover:text-black transition"
          >
            {loading
              ? "Logging in..."
              : "Admin Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;