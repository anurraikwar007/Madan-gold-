import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const savedUser =
      localStorage.getItem("madan-user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);

  }, []);

  /* LOGIN */
  const login = (email, password) => {

    const users =
      JSON.parse(
        localStorage.getItem("madan-users")
      ) || [];

    const existingUser =
      users.find(
        (u) =>
          u.email === email &&
          u.password === password
      );

    if (!existingUser) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    localStorage.setItem(
      "madan-user",
      JSON.stringify(existingUser)
    );

    setUser(existingUser);

    return {
      success: true,
    };
  };

  /* SIGNUP */
  const signup = ({
    name,
    email,
    password,
  }) => {

    const users =
      JSON.parse(
        localStorage.getItem("madan-users")
      ) || [];

    const userExists =
      users.find((u) => u.email === email);

    if (userExists) {

      return {
        success: false,
        message: "User already exists",
      };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: "customer",
    };

    const updatedUsers = [
      ...users,
      newUser,
    ];

    localStorage.setItem(
      "madan-users",
      JSON.stringify(updatedUsers)
    );

    localStorage.setItem(
      "madan-user",
      JSON.stringify(newUser)
    );

    setUser(newUser);

    return {
      success: true,
    };
  };

  /* LOGOUT */
  const logout = () => {

    localStorage.removeItem("madan-user");

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