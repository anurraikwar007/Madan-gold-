import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}) => {

  const { user, loading } = useAuth();

  /* LOADING */
  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-lg
        "
      >
        Loading...
      </div>

    );
  }

  /* NOT LOGGED IN */
  if (!user) {

    return <Navigate to="/login" />;
  }

  /* ADMIN CHECK */
  if (
    adminOnly &&
    user.role !== "admin"
  ) {

    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;