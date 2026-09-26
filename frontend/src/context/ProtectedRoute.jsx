import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdf6ec]">
        <p className="text-[#0b306b]">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    if (user?.role === "donor") {
      return <Navigate to="/donor-dashboard" replace />;
    }

    if (user?.role === "ngo") {
      return <Navigate to="/ngo-dashboard" replace />;
    }

    if (user?.role === "volunteer") {
      return <Navigate to="/volunteer-dashboard" replace />;
    }

    return <Navigate to="/role-selection" replace />;
  }

  return children;
}

export default ProtectedRoute;
