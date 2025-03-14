import { useNavigate, Link } from "react-router-dom"; // ✅ Correct import
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Display errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:3000/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure session cookie is sent with the request
      });

      if (response.ok) {
        console.log("Logged in successfully!");
        navigate("/home"); // Redirect to home feed after successful login
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3E2723] to-[#5D4037] text-white">
      <div className="bg-[#F5E6C8] text-[#3E2723] w-full max-w-md p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">📖 Login to Chronicles</h2>

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            className="mb-4 p-3 rounded-lg bg-[#D7CCC8] text-[#3E2723] outline-none focus:ring-2 focus:ring-[#795548]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-4 p-3 rounded-lg bg-[#D7CCC8] text-[#3E2723] outline-none focus:ring-2 focus:ring-[#795548]"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#795548] text-[#F5E6C8] font-bold py-3 rounded-lg hover:bg-[#8D6E63] transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#5D4037] font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
