import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as AuthAPI from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load User
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        setUser(parsedUser);

        if (
          parsedUser.role === "Admin" ||
          parsedUser.role === "SuperAdmin"
        ) {
          loadAdminProfile();
        } else {
          loadProfile();
        }

        return;
      } catch {
        localStorage.removeItem("user");
      }
    }

    loadProfile();
  }, []);

  // =========================
  // Customer Profile
  // =========================

  const loadProfile = async () => {
    try {
      const { data } = await AuthAPI.getProfile();

      const customer =
        data?.data?.customer ||
        data?.data?.user ||
        data?.data;

      if (customer) {
        setUser(customer);

        localStorage.setItem(
          "user",
          JSON.stringify(customer)
        );
      }

      return customer;
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Admin Profile
  // =========================

  const loadAdminProfile = async () => {
    try {
      const { data } =
        await AuthAPI.adminGetProfile();

      const admin =
        data?.data?.admin ||
        data?.data;

      if (admin) {
        setUser(admin);

        localStorage.setItem(
          "user",
          JSON.stringify(admin)
        );
      }

      return admin;
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Customer Login
  // =========================

  const login = async (
    email,
    password
  ) => {
    try {
      const { data } =
        await AuthAPI.login({
          email,
          password,
        });

      const accessToken =
        data?.data?.accessToken;

      if (!accessToken) {
        return {
          success: false,
          message:
            "Login successful but access token missing.",
        };
      }

      localStorage.setItem(
        "token",
        accessToken
      );

      const customer =
        data?.data?.customer;

      if (customer) {
        setUser(customer);

        localStorage.setItem(
          "user",
          JSON.stringify(customer)
        );
      } else {
        await loadProfile();
      }

      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Login Failed",
      };
    }
  };

  // =========================
  // Customer Signup
  // =========================

    const signup = async ({
      name,
      email,
      password,
      phone,
    }) => {
      try {
        await AuthAPI.register({
          name,
          email,
          password,
          phone,
        });

        return {
          success: true,
          requiresVerification: true,
          message:
            "Signup successful. Please verify your email before logging in.",
        };
      } catch (err) {
        return {
          success: false,
          message:
            err.response?.data?.message ||
            "Signup Failed",
        };
      }
    };

  // =========================
  // Admin Login
  // =========================

  const adminLogin = async (
    email,
    password
  ) => {
    try {
      const { data } =
        await AuthAPI.adminLogin({
          email,
          password,
        });

      const accessToken =
        data?.data?.accessToken;

      if (!accessToken) {
        return {
          success: false,
          message:
            "Admin login successful but access token missing.",
        };
      }

      localStorage.setItem(
        "token",
        accessToken
      );

      const admin =
        data?.data?.admin;

      if (admin) {
        setUser(admin);

        localStorage.setItem(
          "user",
          JSON.stringify(admin)
        );
      } else {
        await loadAdminProfile();
      }

      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Admin login failed",
      };
    }
  };

  // =========================
  // Logout
  // =========================

  const logout = async () => {
    try {
      if (
        user?.role === "Admin" ||
        user?.role === "SuperAdmin"
      ) {
        await AuthAPI.adminLogout();
      } else {
        await AuthAPI.logout();
      }
    } catch {}

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        adminLogin,
        logout,
        loadProfile,
        loadAdminProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);