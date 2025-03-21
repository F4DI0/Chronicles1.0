import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import UserContext

function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useUser(); // Get setUser from UserContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const userData = { firstname: firstName, lastname: lastName, username, email, password, rpassword: confirmPassword };

    try {
      const response = await fetch('http://localhost:3000/account/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert("Sign Up Successful!");

        // Fetch user data immediately after signup
        const userResponse = await fetch("http://localhost:3000/users/myprofile", {
          credentials: "include",
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.myinfo); // Update UserContext with the fetched user data
        }

        navigate("/home"); // Redirect to home page
      } else {
        setErrorMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while connecting to the server.");
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3E2723] to-[#5D4037] text-white">
      <div className="bg-[#F5E6C8] text-[#3E2723] w-full max-w-md p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">📖 Create an Account</h2>

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="mb-3 w-1/2 p-3 rounded-lg bg-[#D7CCC8] text-[#3E2723] outline-none focus:ring-2 focus:ring-[#795548]"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="mb-3 w-1/2 p-3 rounded-lg bg-[#D7CCC8] text-[#3E2723] outline-none focus:ring-2 focus:ring-[#795548]"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            className="mb-3 p-3 rounded-lg bg-[#D7CCC8] text-[#3E2723] outline-none focus:ring-2 focus:ring-[#795548]"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="mb-3 p-3 rounded-lg bg-[#D7CCC8] text-[#3E2723] outline-none focus:ring-2 focus:ring-[#795548]"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-3 p-3 rounded-lg bg-[#D7CCC8] text-[#3E2723] outline-none focus:ring-2 focus:ring-[#795548]"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            autoComplete="new-password"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="mb-3 p-3 rounded-lg bg-[#D7CCC8] text-[#3E2723] outline-none focus:ring-2 focus:ring-[#795548]"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            autoComplete="new-password"
            required
          />
          <button
            type="submit"
            className="bg-[#795548] text-[#F5E6C8] font-bold py-3 rounded-lg hover:bg-[#8D6E63] transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-[#5D4037] font-bold hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;