import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(() => location.pathname === "/register");

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
  }, [location.pathname]);

  const handleToggle = () => {
    if (isRegister) {
      navigate("/login", { replace: true });
    } else {
      navigate("/register", { replace: true });
    }
    setIsRegister(!isRegister);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-hero">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-gray-800">CampusConnect</h1>
          <p className="text-sm text-gray-600">Connect with your university community</p>
        </div>
        <div className="mt-4">
          {isRegister ? <Register /> : <Login />}
        </div>
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-primary hover:underline text-sm font-medium"
            onClick={handleToggle}
          >
            {isRegister ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}