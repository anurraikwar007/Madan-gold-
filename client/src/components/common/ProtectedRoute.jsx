import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}) => {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={
          adminOnly
            ? "/admin/login"
            : "/login"
        }
        replace
      />
    );
  }

  if (adminOnly) {
    const isAdmin =
      user.role === "Admin" ||
      user.role === "SuperAdmin";

    if (!isAdmin) {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;