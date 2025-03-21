import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useDarkMode } from "../context/DarkModeContext"; // Import Dark Mode Context
import { useUser } from "../context/userContext"; // Import UserContext to get the current user
import LoadingSpinner from "../components/LoadingSpinner"; // Import Loading Spinner

function Recent() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // Use Dark Mode State
  const { user: currentUser } = useUser(); // Get the currently signed-in user
  const [accounts, setAccounts] = useState([]); // State to store fetched accounts
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch all accounts from the backend
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/allusers", {
          credentials: "include", // Include cookies for session-based auth
        });

        if (response.ok) {
          const data = await response.json();
          // Filter out the currently signed-in user
          const filteredAccounts = data.filter(
            (account) => account._id !== currentUser?._id
          );
          setAccounts(filteredAccounts); // Store filtered accounts in state
        } else {
          console.error("Failed to fetch accounts");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchAccounts();
  }, [currentUser?._id]); // Re-fetch if the current user changes

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner while fetching data
  }

  return (
    <div
      className={`w-3/4 my-5 shadow-md rounded-3xl overflow-hidden relative hidden lg:flex items-center justify-center flex-col transition-all duration-300 ${
        darkMode
          ? "bg-black/20 text-white" // Dark Mode (Original Styling)
          : "bg-warmBeige text-warmText border border-warmBrown" // Light Mode (Beige & Brown)
      }`}
    >
      <span
        className={`w-full px-5 font-bold text-xl flex items-center justify-start my-4 ${
          darkMode ? "text-white" : "text-warmBrown"
        }`}
      >
        Suggested Writers
      </span>

      {/* Scrollable List */}
      <div className="w-full h-64 overflow-y-auto px-5">
        {accounts.map((account) => (
          <div
            key={account._id}
            className={`w-full rounded-lg shadow-lg my-2 p-3 transition-all duration-300 ${
              darkMode ? "bg-[#05141D]" : "bg-warmBrown text-warmBeige"
            }`}
          >
            <div className="flex items-center justify-between">
              {/* User Info */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate(`/userProfile/${account._id}`)}
              >
                <img
                  src={account.photoURL || "/user.png"} // Use default image if photoURL is not available
                  alt={account.username}
                  className="w-10 h-10 border-2 rounded-full object-cover transition-all duration-300 
                  border-gray-300 dark:border-gray-500"
                />
                <h1
                  className={`text-sm font-semibold ml-3 transition-all duration-300 ${
                    darkMode ? "text-gray-300" : "text-warmBeige"
                  }`}
                >
                  {account.username}
                </h1>
              </div>

              {/* Close Button */}
              <RxCross2
                className={`cursor-pointer transition-all duration-300 ${
                  darkMode ? "text-white hover:text-red-500" : "text-warmBeige hover:text-red-600"
                }`}
              />
            </div>

            {/* Follow Button */}
            <button
              className={`w-full mt-2 font-semibold text-xs px-3 py-2 rounded-xl transition-all duration-300 ${
                darkMode
                  ? "bg-[#C29F70] text-white hover:bg-[#B08E5F]"
                  : "bg-warmBeige text-warmBrown border border-warmBrown hover:bg-[#E4D5C7]"
              }`}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recent;