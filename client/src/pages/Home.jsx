import { useEffect } from "react";
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from "../context/userContext";
import LoadingSpinner from "../components/LoadingSpinner";
import NewpostUploader from "../components/NewpostUploader";
import Post from "../components/Post";
import ProfileCom from "../components/ProfileCom";
import Recent from "../components/Recent";

function Home() {
  const { darkMode } = useDarkMode();
  const { user, loading } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }
 
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Fixed left sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-max z-10">
        <div
          className={`h-full p-4 ${
            darkMode
              ? "border-r border-gray-700 bg-[#2B1D14]"
              : "border-r border-warmBrown bg-warmBeige"
          }`}
        >
          <ProfileCom />
        </div>
      </div>

      {/* Scrollable main content */}
      <div className="flex-1 max-w-5xl mx-auto w-full min-w-0">
        <div
          className={`min-h-screen p-4 ${
            darkMode ? "bg-[#2B1D14]" : "bg-warmBeige"
          }`}
        >
          {user?.isWriter && <NewpostUploader />}
          <Post />
        </div>
      </div>

      {/* Fixed right sidebar */}
      <div className="hidden lg:block fixed right-0 top-0 h-screen w-max z-10">
        <div
          className={`h-full p-4 ${
            darkMode
              ? "border-l border-gray-700 bg-[#2B1D14]"
              : "border-l border-warmBrown bg-warmBeige"
          }`}
        >
          <Recent />
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-20`}
        aria-label="Scroll to top"
      >
        <span className="text-2xl">↑</span>
      </button>
    </div>
  );
}

export default Home;
