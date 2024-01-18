import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // this affect is executed after the render has already happened
  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  //   effect works after browser paint, so after 'return children',
  //    and in those children is User component, that's why the bug is because of it

  //   return children // WRONG!

  return isAuthenticated ? children : null; // CORRECT
}

export default ProtectedRoute;
