import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { motion } from "framer-motion";

function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const userData = { firstname: firstName, lastname: lastName, username, email, password, rpassword: confirmPassword };

    try {
      const response = await fetch('http://localhost:3000/account/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert("Sign Up Successful!");
        const userResponse = await fetch("http://localhost:3000/users/myprofile", { credentials: "include" });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.myinfo);
        }

        navigate("/home");
      } else {
        setErrorMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while connecting to the server.");
      console.error("Error signing up:", error);
    }
  };

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-warmBrown via-[#2f2f2f] to-[#1a1a1a] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Glowing circles for background effect */}
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
          Join <span className="text-warmBeige font-extrabold drop-shadow">Chronicles</span>
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-center font-medium mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-1/2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-warmBeige outline-none"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-1/2 p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-warmBeige outline-none"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-warmBeige outline-none"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-warmBeige outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-warmBeige outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            autoComplete="new-password"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-warmBeige outline-none"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            className="w-full bg-warmBrown hover:ring-warmBeige transition-colors py-3 rounded-lg font-bold text-white tracking-wide shadow-lg"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-warmBeige font-bold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default SignUp;
