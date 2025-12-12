import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // není přihlášen → přesměruj na AUTH stránku
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // je přihlášen → zobraz stránku
  return children;
};

export default ProtectedRoute;
