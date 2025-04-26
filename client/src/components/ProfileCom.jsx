import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from "../context/userContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";

function ProfileCom() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { user, loading: userLoading } = useUser();

  const [userData, setUserData] = useState({
    followers: 0,
    following: 0,
  });
  
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

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

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        
        setUserData({
          followers: data.followers || 0,
          following: data.following || 0,
        });

        setPreferences(data.preferences || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading || userLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="sticky mt-20 top-4 h-[calc(100vh-2rem)] overflow-y-auto"> {/* Fixed container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full rounded-2xl relative flex flex-col items-center p-6 transition-all duration-300 ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-warmBrown text-warmBeige border-b-2 border-warmBeige"
        }`}
      >
      {/* Profile Image with Animation */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-36 h-36 rounded-full overflow-hidden border-4 mb-4 relative group"
        style={{
          borderColor: darkMode ? "#4b5563" : "#F5E1C8",
          boxShadow: darkMode 
            ? "0 4px 20px rgba(59, 130, 246, 0.2)" 
            : "0 4px 20px rgba(217, 119, 6, 0.2)"
        }}
      >
        <img
          src={preferences?.profilepic ? `http://localhost:3000/${preferences.profilepic}` : "/user.png"}
          alt="Profile"
          className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
          onError={(e) => {
            e.target.src = "/user.png";
          }}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-300" />
      </motion.div>

      {/* User Info */}
      <div className="text-center w-full">
        <motion.h1 
          className={`text-3xl font-bold capitalize mb-1 ${
            darkMode ? "text-gray-100" : "text-warmBeige"
          }`}
          whileHover={{ scale: 1.02 }}
        >
          {user.username || "User Name"}
        </motion.h1>
        
        <motion.h2 
          className={`text-lg font-medium ${
            darkMode ? "text-gray-400" : "text-warmBeige"
          }`}
          whileHover={{ scale: 1.01 }}
        >
          {[user.firstname, user.lastname].filter(Boolean).join(' ') || "First Last"}
        </motion.h2>
        
        {/* Bio */}
        {preferences?.bio && (
          <motion.p 
            className={`mt-3 text-sm max-w-md mx-auto px-4 py-2 rounded-lg ${
              darkMode 
                ? "bg-gray-700/50 text-gray-300" 
                : "bg-warmBeige text-warmBrown"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {preferences.bio}
          </motion.p>
        )}
      </div>

      {/* Stats with Animation */}
      <motion.div
        className={`flex justify-around w-full mt-6 pt-4 rounded-xl ${
          darkMode ? "bg-gray-700/30" : "text-warmBeige"
        }`}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div 
          className="text-center px-4 py-2 rounded-lg cursor-default"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: darkMode ? "rgba(75, 85, 99, 0.4)" : "rgba(253, 230, 138, 0.5)"
          }}
        >
          <h1 className={`text-2xl font-bold ${
            darkMode ? "text-blue-400" : "text-warmBeige"
          }`}>
            {userData.followers.toLocaleString()}
          </h1>
          <h2 className={`text-sm font-medium ${
            darkMode ? "text-gray-400" : "text-warmBeige"
          }`}>
            Followers
          </h2>
        </motion.div>
        
        <div className={`h-10 w-px ${darkMode ? "bg-gray-600" : "bg-warmBeige"}`} />
        
        <motion.div 
          className="text-center px-4 py-2 rounded-lg cursor-default"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: darkMode ? "rgba(75, 85, 99, 0.4)" : "rgba(253, 230, 138, 0.5)"
          }}
        >
          <h1 className={`text-2xl font-bold ${
            darkMode ? "text-blue-400" : "text-warmBeige"
          }`}>
            {userData.following.toLocaleString()}
          </h1>
          <h2 className={`text-sm font-medium ${
            darkMode ? "text-gray-400" : "text-warmBeige"
          }`}>
            Following
          </h2>
        </motion.div>
      </motion.div>

      {/* Profile Button with Animation */}
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: darkMode ? "0 4px 20px rgba(59, 130, 246, 0.4)" : "0 4px 20px rgba(217, 119, 6, 0.4)" }}
        whileTap={{ scale: 0.98 }}
        className={`mt-6 text-lg font-semibold w-full rounded-xl py-3 transition-all duration-300 ${
          darkMode 
            ? "bg-gray-900 hover:bg-blue-700 text-white" 
            : "bg-warmBeige hover:bg-warmBeige text-warmBrown"
        }`}
        onClick={() => navigate(`/userProfile/${user._id}`)}
      >
        View Full Profile
      </motion.button>
    </motion.div>
    </div>
  );
}

export default ProfileCom;
