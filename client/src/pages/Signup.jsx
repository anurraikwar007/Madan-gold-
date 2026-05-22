import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Signup = () => {

  const navigate = useNavigate();

  const { signup } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* HANDLE CHANGE */
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* HANDLE SIGNUP */
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    setTimeout(() => {

      const result = signup(formData);

      if (!result.success) {

        setError(result.message);

        setLoading(false);

        return;
      }

      navigate("/");

    }, 800);
  };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        bg-[#FAF9F6]
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-[2rem]
          p-8
          luxury-shadow
        "
      >

        {/* HEADER */}
        <div className="text-center mb-8">

          <p
            className="
              text-[#D4AF37]
              uppercase
              tracking-[0.3em]
              text-xs
            "
          >
            Create Account
          </p>

          <h1
            className="
              heading
              text-4xl
              mt-4
            "
          >
            Signup
          </h1>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}
          <div>

            <label className="text-sm mb-2 block">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              required
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              className="
                w-full
                h-14
                px-5
                rounded-2xl
                border
                border-black/10
                bg-[#FAF9F6]
              "
            />

          </div>

          {/* EMAIL */}
          <div>

            <label className="text-sm mb-2 block">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="
                w-full
                h-14
                px-5
                rounded-2xl
                border
                border-black/10
                bg-[#FAF9F6]
              "
            />

          </div>

          {/* PASSWORD */}
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
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border
                  border-black/10
                  bg-[#FAF9F6]
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                "
              >

                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

          </div>

          {/* ERROR */}
          {error && (

            <div
              className="
                text-red-500
                text-sm
              "
            >
              {error}
            </div>

          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-14
              rounded-2xl
              bg-[#111]
              text-white
              font-medium
              transition-all
              duration-300
              hover:bg-[#D4AF37]
              hover:text-black
            "
          >

            {loading
              ? "Creating..."
              : "Create Account"}

          </button>

        </form>

        {/* FOOTER */}
        <div
          className="
            text-center
            mt-6
            text-sm
          "
        >

          Already have an account?{" "}

          <Link
            to="/login"
            className="
              text-[#D4AF37]
              font-medium
            "
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Signup;