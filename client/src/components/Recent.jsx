import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from "../context/userContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import ProfileFollowButton from "../components/ProfileFollowButton";

function Recent() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { user: currentUser } = useUser();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePics, setProfilePics] = useState({});

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/users/allusers", {
          credentials: "include",
        });

        if (res.ok) {
          const accountsData = await res.json();
          const filteredAccounts = accountsData.filter(
            (account) => account._id !== currentUser?._id
          );
          setAccounts(filteredAccounts);

          // Fetch profile pictures
          const pics = {};
          for (const account of filteredAccounts) {
            const res = await fetch(`http://localhost:3000/users/${account._id}`, {
              credentials: "include",
            });
            if (res.ok) {
              const userData = await res.json();
              if (userData.preferences?.profilepic) {
                pics[account._id] = `http://localhost:3000/${userData.preferences.profilepic}`;
              }
            }
          }
          setProfilePics(pics);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [currentUser?._id]);

  if (loading) {
    return (
      <div className={`hidden lg:flex w-72 h-64 items-center justify-center ${darkMode ? "bg-gray-900" : "bg-warmBeige"
        }`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`hidden lg:flex mt-20 flex-col w-72 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 ${darkMode ? "bg-gray-900/50" : "bg-warmBrown"
        }`}
    >
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-warmBeige"
        }`}>
        Suggested Writers
      </h2>

      <div className="space-y-3">
        {accounts.map((account) => (
          <motion.div
            key={account._id}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-amber-50 border border-amber-100"
              }`}
          >
            <div
              className="flex items-center cursor-pointer flex-1"
              onClick={() => navigate(`/user/${account._id}`)}
            >
              <div className="relative">
                <img
                  src={profilePics[account._id] || "/user.png"}
                  alt={account.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                  onError={(e) => {
                    e.target.onerror = null; // prevents looping
                    e.target.src = "/user.png";
                  }}
                />
                {account.isWriter && (
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${darkMode ? "border-gray-800 bg-blue-200" : "border-black bg-blue-200"
                    }`} />
                )}
              </div>
              <div className="ml-3 overflow-auto">
                <h3 className={`font-medium truncate ${darkMode ? "text-white" : "text-warmBrown"
                  }`}>
                  {account.username}
                </h3>
                <p className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-amber-700"
                  }`}>
                  {account.firstname} {account.lastname}
                </p>
              </div>
            </div>

            {currentUser?._id !== account._id && (
              <div className="ml-2">
                <ProfileFollowButton profileUserId={account._id} size="small" />
              </div>
            )}
          </motion.div>
        ))}

        {accounts.length === 0 && (
          <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-amber-700"
            }`}>
            No suggested writers found
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default Recent;
