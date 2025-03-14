import NewpostUploader from "../components/NewpostUploader";
import Post from "../components/Post";
import ProfileCom from "../components/ProfileCom";
import Recent from "../components/Recent";
import Genres from "../components/Genres";
import { useEffect } from "react";
import { useDarkMode } from "../context/DarkModeContext"; // ✅ Import Dark Mode Context

function Home() {
  const { darkMode } = useDarkMode(); // ✅ Get Dark Mode State

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`w-full flex items-start justify-center min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#2B1D14] text-white" // ✅ Dark Mode (Original Color)
          : "bg-warmBeige text-warmText" // ✅ Light Mode (Beige Theme)
      }`}
    >
      {/* Left side components */}
      <div
        className={`hidden lg:flex items-center justify-center flex-col p-4 w-0 md:w-1/4 sticky left-0 top-16 ${
          darkMode ? "bg-[#2B1D14]" : "bg-warmBeige text-warmText border border-warmBrown"
        }`}
      >
        <ProfileCom />
        <Genres />
      </div>

      {/* Center side components */}
      <div
        className={`flex items-center justify-center flex-col p-3 w-full lg:w-1/2 ${
          darkMode ? "bg-[#2B1D14]" : "bg-warmBeige text-warmText"
        }`}
      >
        <NewpostUploader />
        <Post />
      </div>

      {/* Right side components */}
      <div
        className={`hidden lg:flex items-center justify-center flex-col p-3 w-1/4 sticky right-0 top-16 ${
          darkMode ? "bg-[#2B1D14]" : "bg-warmBeige text-warmText border border-warmBrown"
        }`}
      >
        <Recent />
      </div>
    </div>
  );
}

export default Home;
