import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}) => {
  const {
    user,
    loading,
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-[#D4AF37]" />

          <p className="text-sm text-gray-500">
            Loading...
          </p>
        </div>
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
        state={{
          from: location.pathname,
        }}
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

  if (
    !adminOnly &&
    user.role !== "Customer"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;