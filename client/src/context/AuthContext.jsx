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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await AuthAPI.getProfile();

      setUser(
      data.data.customer ||
      data.data.user ||
      data.data
    );
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const { data } = await AuthAPI.login({
        email,
        password,
      });

      localStorage.setItem(
        "token",
        data.data.token
      );

      await loadProfile();

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

  const signup = async ({
    name,
    email,
    password,
    phone,
  }) => {
    try {
      const { data } =
        await AuthAPI.register({
          name,
          email,
          password,
          phone,
        });

      localStorage.setItem(
        "token",
        data.data.token
      );

      await loadProfile();

      return {
        success: true,
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

  const logout = async () => {
      try {
        await AuthAPI.logout?.();
      } catch {}

      localStorage.removeItem("token");
      setUser(null);
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);