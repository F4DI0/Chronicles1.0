import NewpostUploader from "../components/NewpostUploader";
import Post from "../components/Post";
import ProfileCom from "../components/ProfileCom";
import Recent from "../components/Recent";
import Genres from "../components/Genres";
import { useEffect } from "react";
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from "../context/userContext";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the loading spinner

function Home() {
  const { darkMode } = useDarkMode();
  const { user, loading } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner while fetching data
  }

  return (
    <div
      className={`w-full flex items-start justify-center min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#2B1D14] text-white"
          : "bg-warmBeige text-warmText"
      }`}
    >
      {/* Left side components */}
      <div
        className={`hidden lg:flex flex-col p-4 w-80 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r ${
          darkMode ? "border-gray-700 bg-[#2B1D14]" : "border-warmBrown bg-warmBeige text-warmText"
        }`}
      >
        <ProfileCom />
      </div>

      {/* Center side components */}
      <div
        className={`flex flex-col p-3 w-full lg:w-[calc(100%-32rem)] max-w-4xl mx-auto ${
          darkMode ? "border-gray-700 bg-[#2B1D14]" : "border-warmBrown bg-warmBeige text-warmText"
        }`}
      >
        {/* Conditionally render NewpostUploader for Writers */}
        {user?.isWriter && <NewpostUploader />}
        <Post />
      </div>

      {/* Right side components */}
      <div
        className={`hidden lg:flex flex-col p-3 w-80 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l ${
          darkMode ? "border-gray-700 bg-[#2B1D14]" : "border-warmBrown bg-warmBeige text-warmText"
        }`}
      >
        <Recent />
      </div>
    </div>
  );
}

export default Home;