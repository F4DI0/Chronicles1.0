import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/userContext";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3000/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        const userResponse = await fetch("http://localhost:3000/users/myprofile", {
          credentials: "include",
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.myinfo);
        }

        navigate("/home");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-warmBrown via-[#2f2f2f] to-[#1a1a1a] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Glowing background orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-warmBeige rounded-full filter blur-3xl opacity-30 top-[-10%] left-[-10%] animate-pulse"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-warmBeige rounded-full filter blur-3xl opacity-20 bottom-[-10%] right-[-10%] animate-pulse"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-10 shadow-2xl w-full max-w-md z-10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">
          Welcome Back to <span className="text-warmBeige font-extrabold drop-shadow">Chronicles</span>
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-center font-medium mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-warmBrown outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-warmBrown outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-warmBrown hover:bg-warnBeige text-white font-semibold rounded-lg transition"
          >
            Login
          </motion.button>
        </form>

        <p className="text-sm text-center text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold text-warmBeige hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Login;
