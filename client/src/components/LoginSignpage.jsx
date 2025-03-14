import { useState } from "react";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

function LoginSignpage() {
  const [isLogin, setIsLogin] = useState(true); // Track Login or Signup page

  return (
    <div className="lg:flex items-center justify-center overflow-hidden relative">
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
        <img src="/logo.png" alt="logo" className="lg:w-20 lg:h-20 w-12 h-12" />
      </div>

      {/* Toggle between Login and Signup */}
      {isLogin ? (
        <Login switchToSignup={() => setIsLogin(false)} />
      ) : (
        <SignUp switchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export default LoginSignpage;
