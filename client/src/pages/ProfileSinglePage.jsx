import { useState, useEffect } from "react";
import NewpostUploader from "../components/NewpostUploader";
import Post from "../components/Post";
import { LuImagePlus  } from "react-icons/lu";
import { AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext"; // ✅ Import Dark Mode

function ProfileSinglePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // ✅ Use Dark Mode

  // Dummy user data (Replace with actual user data)
  const [userData, setUserData] = useState({
    name: "William Shakespeare",
    bio: "A passionate reader and aspiring writer.",
    interests: ["1984", "The Great Gatsby", "To Kill a Mockingbird"],
  });

  return (
    <div
      className={`w-full p-4 flex flex-col items-center transition-all duration-300 ${
        darkMode
          ? "bg-[#2B1D14] text-white" // ✅ Dark Mode (Original Styling)
          : "bg-warmBeige text-warmText" // ✅ Light Mode (Warm Colors)
      }`}
    >
      {/* Cover Photo & Profile Picture */}
      <div className="w-full max-w-4xl relative">
        <div
          className={`w-full h-[40vh] md:h-[50vh] lg:h-[55vh] overflow-hidden rounded-2xl shadow-md flex items-center justify-center transition-all duration-300 ${
            darkMode ? "bg-black" : "bg-warmBrown"
          }`}
        >
          <img
            src="/cover4.webp"
            alt="Cover"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="absolute bottom-[-3rem] left-1/2 transform -translate-x-1/2">
          <img
            src="/Shakes.jpg"
            alt="Profile"
            className={`w-28 h-28 sm:w-32 sm:h-32 border-4 bg-slate-500 object-cover rounded-full ${
              darkMode ? "border-gray-700" : "border-warmBrown"
            }`}
          />
        </div>
        <input type="file" id="image" className="hidden" accept="image/*" />
        <label htmlFor="image">
          <LuImagePlus
            fontSize={25}
            className={`absolute right-3 bottom-2 cursor-pointer transition ${
              darkMode ? "text-white hover:text-gray-300" : "text-warmBrown hover:text-warmText"
            }`}
          />
        </label>
      </div>

      {/* User Info Section */}
      <div className="mt-20 text-center w-full px-4">
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-warmBrown"}`}>
          {userData.name}
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-warmText"}`}>
          {userData.bio}
        </p>

        <div className="mt-4 flex flex-col items-center gap-3">
          {/* Edit Profile Button */}
          <button
            onClick={() => navigate("/edit-profile")}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 ${
              darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-warmBrown hover:bg-[#A07355] text-warmBeige"
            }`}
          >
            < LuImagePlus /> Edit Profile
          </button>

          {/* View Liked Posts Button */}
          <button
            onClick={() => navigate("/liked-posts")}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 ${
              darkMode ? "bg-red-700 hover:bg-red-600 text-white" : "bg-warmBrown hover:bg-[#A07355] text-warmBeige"
            }`}
          >
            <AiOutlineHeart /> View Liked Posts
          </button>
        </div>
      </div>

      {/* Interests Section */}
      <div
        className={`mt-6 w-full max-w-4xl p-4 rounded-lg shadow-md transition-all duration-300 ${
          darkMode ? "bg-[#1f1410] text-gray-300" : "bg-warmBeige text-warmText border border-warmBrown"
        }`}
      >
        <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-warmBrown"}`}>
          Favorite Books
        </h2>
        <ul className="mt-2">
          {userData.interests.map((book, index) => (
            <li key={index}>📖 {book}</li>
          ))}
        </ul>
      </div>

      {/* Posts Section */}
      <div className="mt-6 w-full max-w-4xl flex flex-col items-center gap-6">
        <NewpostUploader />
        <Post />
      </div>
    </div>
  );
}

export default ProfileSinglePage;
