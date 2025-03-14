import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineLogin } from "react-icons/ai";
import { FaBookOpen, FaUserEdit } from "react-icons/fa";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3E2723] to-[#5D4037] text-white flex flex-col items-center">
      {/* Header */}
      <motion.header
        className="w-full flex items-center justify-between px-6 py-4 fixed top-0 bg-[#2B1D14] bg-opacity-90 backdrop-blur-md z-50 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Chronicles Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold tracking-wide text-[#F5E6C8]">Chronicles</h1>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-4 py-2 bg-[#203A43] text-[#F5E6C8] rounded-md hover:bg-[#2C5364] transition"
          >
            <AiOutlineLogin /> Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5E3C] text-white rounded-md hover:bg-[#A67B5B] transition"
          >
            <FaUserEdit /> Sign Up
          </button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center text-center mt-32 p-10">
        <motion.h2
          className="text-5xl font-extrabold tracking-wider text-[#F5E6C8] drop-shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to **Chronicles** 📚
        </motion.h2>
        <motion.p
          className="text-[#E4C9A8] mt-4 max-w-2xl text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          A place where book lovers connect, share, and explore the world of literature.
        </motion.p>
      </section>

      {/* Features Section */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10 py-12">
        <motion.div
          className="bg-[#5D4037] p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <FaBookOpen className="text-4xl mx-auto text-yellow-400 mb-4" />
          <h3 className="text-xl font-semibold text-[#F5E6C8]">Discover New Books</h3>
          <p className="text-[#E4C9A8] mt-2">Explore a vast library of books recommended by readers worldwide.</p>
        </motion.div>

        <motion.div
          className="bg-[#5D4037] p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <FaUserEdit className="text-4xl mx-auto text-blue-300 mb-4" />
          <h3 className="text-xl font-semibold text-[#F5E6C8]">Share Your Thoughts</h3>
          <p className="text-[#E4C9A8] mt-2">Write reviews, engage in discussions, and connect with fellow book enthusiasts.</p>
        </motion.div>

        <motion.div
          className="bg-[#5D4037] p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <AiOutlineLogin className="text-4xl mx-auto text-green-400 mb-4" />
          <h3 className="text-xl font-semibold text-[#F5E6C8]">Join the Community</h3>
          <p className="text-[#E4C9A8] mt-2">Sign up and be part of a growing community of book lovers.</p>
        </motion.div>
      </section>

      {/* Call to Action */}
      <motion.section
        className="w-full flex flex-col items-center bg-[#3E2723] p-12 rounded-lg mt-10 text-center shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-[#F5E6C8]">Start Your Book Journey Today!</h2>
        <p className="text-[#E4C9A8] mt-2">Join a community that appreciates literature and storytelling.</p>
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-[#8B5E3C] text-white rounded-md hover:bg-[#A67B5B] transition text-lg"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[#203A43] text-[#F5E6C8] rounded-md hover:bg-[#2C5364] transition text-lg"
          >
            Login
          </button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full text-center py-6 mt-10 text-[#E4C9A8]">
        © 2024 Chronicles. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
