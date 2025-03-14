import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext"; // ✅ Import Dark Mode Context

function ProfileCom() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // ✅ Use Dark Mode State

  const userData = {
    id: "12345", // Mock user ID
    url: "/user.png", // Mock profile image URL
    name: "User Name", // Mock user name
    email: "user@example.com", // Mock user email
  };

  return (
    <div
      className={`w-3/4 max-w-lg h-auto shadow-lg rounded-3xl overflow-hidden relative lg:flex flex-col items-center p-6 transition-all duration-300 ${
        darkMode
          ? "bg-black/20 text-white" // ✅ Dark Mode (Original Styling)
          : "bg-warmBeige text-warmText border border-warmBrown" // ✅ Light Mode (Beige & Brown)
      }`}
    >
      {/* Profile Image */}
      <img
        src={userData.url || "/user.png"}
        alt="userPic"
        className="w-28 h-28 object-cover rounded-full border-4 shadow-lg transition-all duration-300 
        border-gray-700 dark:border-gray-600"
      />

      {/* User Info */}
      <div className="text-center mt-4">
        <h1 className={`text-2xl font-bold capitalize ${darkMode ? "text-gray-100" : "text-warmBrown"}`}>
          {userData.name || "User Name"}
        </h1>
        <h2 className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-warmText"}`}>
          {userData.email}
        </h2>
      </div>

      {/* Stats */}
      <div
        className={`flex justify-around w-full mt-5 border-t pt-4 transition-all duration-300 ${
          darkMode ? "border-gray-700" : "border-warmBrown"
        }`}
      >
        <div className="text-center">
          <h1 className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-warmBrown"}`}>1986</h1>
          <h2 className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-warmText"}`}>Followers</h2>
        </div>
        <div className="text-center">
          <h1 className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-warmBrown"}`}>1009</h1>
          <h2 className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-warmText"}`}>Following</h2>
        </div>
      </div>

      {/* Profile Button */}
      <button
        className={`text-lg font-semibold w-4/5 rounded-xl py-3 transition-all duration-300 ${
          darkMode ? "bg-[#05141D] hover:bg-gray-700 text-white" : "bg-warmBrown hover:bg-[#A07355] text-warmBeige"
        }`}
        onClick={() => navigate(`/userProfile/${userData.id}`)} // Use mock user ID
      >
        My Profile
      </button>
    </div>
  );
}

export default ProfileCom;