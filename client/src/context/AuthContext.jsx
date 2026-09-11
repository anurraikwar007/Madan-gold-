import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import * as AuthAPI from "../api/auth.api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 

  // =========================
  // Customer Profile
  // =========================

  const loadProfile = useCallback(async () => {
    try {
      const { data } = await AuthAPI.getProfile();

      const customer =
        data?.data?.customer ||
        data?.data?.user ||
        data?.data;

      if (customer) {
        const normalizedCustomer = {
          ...customer,
          role: customer.role || "Customer",
        };

        setUser(normalizedCustomer);

        localStorage.setItem(
          "user",
          JSON.stringify(normalizedCustomer)
        );

        return normalizedCustomer;
      }

      return customer;
    } catch  {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  },[]);

  // =========================
  // Admin Profile
  // =========================

  const loadAdminProfile = useCallback(async () => {
    try {
      const { data } =
        await AuthAPI.adminGetProfile();

      const admin =
        data?.data?.admin ||
        data?.data;

      if (admin) {
        const normalizedAdmin = {
          ...admin,
          role: admin.role || "Admin",
        };
        setUser(normalizedAdmin);

        localStorage.setItem(
          "user",
          JSON.stringify(normalizedAdmin)
        );

        return normalizedAdmin;
      }

      return admin;
    } catch  {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  },[]);

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
        const normalizedUser = {
          ...parsedUser,
          role:
            parsedUser.role ||
            (parsedUser.email === localStorage.getItem("adminEmail") ? "Admin" : "Customer"),
        };

        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));

        if (
          normalizedUser.role === "Admin" ||
          normalizedUser.role === "SuperAdmin"
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
  }, [loadProfile, loadAdminProfile]);


 // =========================
// Customer Login
// =========================

const login = async (email, password) => {
    try {
      const { data } = await AuthAPI.login({ email, password });
      const accessToken = data?.data?.accessToken;

      if (!accessToken) {
        return { success: false, message: "Login successful but access token missing." };
      }

      localStorage.setItem("token", accessToken);

      const customer = data?.data?.customer || data?.data?.user || data?.data;
      if (customer) {
        const normalizedCustomer = {
          ...customer,
          role: customer.role || "Customer",
        };
        setUser(normalizedCustomer);
        localStorage.setItem("user", JSON.stringify(normalizedCustomer));
      } else {
        await loadProfile();
      }

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login Failed";
      const requiresVerification =
        /verify your email|email.*verified/i.test(message);

      return {
        success: false,
        requiresVerification,
        email,
        message,
      };
    }
  };

  // =========================
  // Customer Signup
  // =========================

    const signup = async ({ name, email, password, phone }) => {
      try {
        const { data } = await AuthAPI.register({ name, email, password, phone });
        localStorage.setItem("verificationEmail", email);

        return {
          success: true,
          requiresVerification: true,
          email,
          message: data?.message ||
            "Signup successful. Please verify your email with the OTP sent to your Gmail.",
        };
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || "Signup Failed",
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
        const normalizedAdmin = {
          ...admin,
          role: admin.role || "Admin",
        };
        setUser(normalizedAdmin);

        localStorage.setItem(
          "user",
          JSON.stringify(normalizedAdmin)
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
    }catch (error) {
      console.warn(
        "Logout request failed:",
        error
      );
    }
    

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    toast.success("You have been signed out securely.");
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