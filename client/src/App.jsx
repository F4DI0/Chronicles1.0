import { Route, Routes, useLocation } from "react-router-dom";
import TopHeader from "./components/TopHeader";
import Home from "./pages/Home"; // ✅ Home is the feed now
import ProfileSinglePage from "./pages/ProfileSinglePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import ViewPost from "./components/ViewPost";
import BecomeWriterForm from "../Forms/BecomeWriterFrom";
import EditProfilePage from "./components/EditeProfilePage";
import LikedPosts from "./pages/LikedPosts";
import LandingPage from "./pages/LandingPage";
import { useDarkMode } from "./context/DarkModeContext"; // ✅ Import dark mode
import WritersInsights from "./components/WritersInsight";
import TextEditor from "./components/editor/TextEditor";

function App() {
  const location = useLocation();
  const { darkMode } = useDarkMode(); // ✅ Use global dark mode

  // Hide the header on Landing Page, Login, and Signup
  const hideHeader = ["/", "/login", "/signup"].includes(location.pathname);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white" // ✅ Dark Mode (default)
          : "bg-warmBeige text-warmText" // ✅ Light Mode (custom colors)
      }`}
    >
      {/* ✅ Show Header only when user is logged in */}
      {!hideHeader && <TopHeader />}

      <Routes>
        {/* ✅ Default Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* ✅ Public Routes (Login & Signup) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ✅ Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/userProfile/:id" element={<ProfileSinglePage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/viewPost/:id" element={<ViewPost />} />
        <Route path="/BecomeWriterForm" element={<BecomeWriterForm />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/liked-posts" element={<LikedPosts />} />
        <Route path="/writers-insight" element={<WritersInsights />} />
        <Route path="/text-editor" element={<TextEditor />} />
      </Routes>
    </div>
  );
}

export default App;
