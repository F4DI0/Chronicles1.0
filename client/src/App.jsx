import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import TopHeader from "./components/TopHeader";
import Home from "./pages/Home";
import ProfileSinglePage from "./pages/MyProfile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import BecomeWriterForm from "../Forms/BecomeWriterFrom";
import EditProfilePage from "./components/EditeProfilePage";
import LikedPosts from "./pages/LikedPosts";
import LandingPage from "./pages/LandingPage";
import { useDarkMode } from "./context/DarkModeContext";
import WritersInsights from "./components/WritersInsights";
import TextEditor from "./components/editor/TextEditor";
import UserProfile from "./pages/UserProfile";
import NewpostUploader from "./components/NewpostUploader";
import ViewPost from "./components/ViewPost"; // Keep import
import AdminValidator from "./pages/AdminValidator";
import StoreHome from './store/StoreHome';
import SellBook from './store/pages/SellBook';
import CheckoutSuccess from './store/pages/CheckoutSuccess';
import BookDetails from './store/pages/BookDetails';

function App() {
  const location = useLocation();
  const { darkMode } = useDarkMode();
  const hideHeader = ["/", "/login", "/signup"].includes(location.pathname);

  // 🔁 Modal logic
  const [selectedPostId, setSelectedPostId] = useState(null);
  const openPostModal = (id) => setSelectedPostId(id);
  const closePostModal = () => setSelectedPostId(null);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 overflow-hidden ${darkMode ? "bg-[#2B1D14] text-white" : "bg-warmBeige text-warmText"
        }`}
      style={{ overflowX: "auto" }}
    >
      {/* Fixed Header */}
      {!hideHeader && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <TopHeader />
        </div>
      )}

      {/* Content with padding to account for fixed header */}
      <div className={`pt-16`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home onOpenPost={openPostModal} />} />
          <Route path="/userProfile/:id" element={<ProfileSinglePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/BecomeWriterForm" element={<BecomeWriterForm />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/liked-posts" element={<LikedPosts />} />
          <Route path="/writers-insight" element={<WritersInsights />} />
          <Route path="/text-editor" element={<TextEditor />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/NewPostUploader" element={<NewpostUploader />} />
          <Route path="/admin-validator" element={<AdminValidator />} />
          <Route path="/bookstore" element={<StoreHome/>} />
          <Route path="/bookstore/sell" element={<SellBook/>} />
          <Route path="/bookstore/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/bookstore/book/:id" element={<BookDetails/>} />
        </Routes>
      </div>
      {/* ✅ Modal rendered globally, always on top */}
      {selectedPostId && (
        <ViewPost postId={selectedPostId} onClose={closePostModal} />
      )}
    </div>
  );
}

export default App;
