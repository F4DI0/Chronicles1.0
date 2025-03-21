import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext"; // Adjust the import path as needed

function ProfileCom() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // Use Dark Mode State

  // State to store user data
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    followers: 0,
    following: 0,
    url: "/user.png", // Default profile image
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/myprofile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log("Fetched user data:", data);

        // Update state with fetched data
        setUserData({
          name: data.myinfo.username || "User Name",
          email: data.myinfo.email || "No email",
          followers: data.followers || 0,
          following: data.following || 0,
          url: data.myinfo.photoURL || "/user.png", // Use default image if no URL is provided
          // id: data.myinfo.id || "", works when backend connected to singlepost
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user data. Please try again.");
      }
    };

    fetchUserData(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div
      className={`w-3/4 max-w-lg h-auto shadow-lg rounded-3xl overflow-hidden relative lg:flex flex-col items-center p-6 transition-all duration-300 ${
        darkMode
          ? "bg-black/20 text-white" // Dark Mode (Original Styling)
          : "bg-warmBeige text-warmText border border-warmBrown" // Light Mode (Beige & Brown)
      }`}
    >
      {/* Profile Image */}
      <img
        src={userData.url}
        alt="userPic"
        className="w-28 h-28 object-cover rounded-full border-4 shadow-lg transition-all duration-300 
        border-gray-700 dark:border-gray-600"
      />

      {/* User Info */}
      <div className="text-center mt-4">
        <h1 className={`text-2xl font-bold capitalize ${darkMode ? "text-gray-100" : "text-warmBrown"}`}>
          {userData.name}
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
          <h1 className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-warmBrown"}`}>
            {userData.followers}
          </h1>
          <h2 className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-warmText"}`}>Followers</h2>
        </div>
        <div className="text-center">
          <h1 className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-warmBrown"}`}>
            {userData.following}
          </h1>
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