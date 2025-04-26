import { useState, useEffect } from "react";
import { AiOutlineHeart, AiOutlineBook, AiOutlineComment } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from "../context/userContext";
import ViewPost from "../components/ViewPost";
import LoadingSpinner from "../components/LoadingSpinner";
import NewpostUploader from "../components/NewpostUploader";
import FollowListModal from "../components/FollowListModal";

function ProfileSinglePage() {
  const { user, loading } = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [preferences, setPreferences] = useState(null);
  const [isViewPostOpen, setIsViewPostOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState("followers");
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();


  const handleViewPost = (postId) => {
    setSelectedPostId(postId);
    setIsViewPostOpen(true);
  };

  // Function to fetch user data (profile info, followers, etc.)
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
      setPreferences(data.preferences || {});
      setFollowersCount(data.followers || 0);
      setFollowingCount(data.following || 0);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to load profile data");
    }
  };

  // Fetch user posts for the logged-in user
  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user._id}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const postsData = await response.json();
      setUserPosts(postsData.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrorMessage("Failed to load posts");
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchUserData();
      fetchUserPosts();
    }
  }, [user]);

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  const openFollowModal = (type) => {
    setFollowModalType(type);
    setIsFollowModalOpen(true);
  };

  const closeFollowModal = () => {
    setIsFollowModalOpen(false);
  };

  return (
    <div className={`min-h-screen w-full transition-all duration-300 mt-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 p-4 border-b ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">{user.username || "username"}</h1>
          <button
            onClick={() => navigate("/settings")}
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <FiSettings size={20} />
          </button>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2">
              <img
                src={preferences?.profilepic ? `http://localhost:3000/${preferences.profilepic}` : "/user.png"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/user.png";
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 flex justify-between">
            <div className="text-center">
              <p className="font-bold">{userPosts.length}</p>
              <p className="text-sm">Posts</p>
            </div>
            <button
              onClick={() => openFollowModal("followers")}
              className="text-center cursor-pointer hover:opacity-80"
            >
              <p className="font-bold">{followersCount}</p>
              <p className="text-sm">Followers</p>
            </button>
            <button
              onClick={() => openFollowModal("following")}
              className="text-center cursor-pointer hover:opacity-80"
            >
              <p className="font-bold">{followingCount}</p>
              <p className="text-sm">Following</p>
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          <div className="flex gap-2">
            <h2 className="font-bold">{user.firstname || "First Name"}</h2>
            <h2 className="font-bold">{user.lastname || "Last Name"}</h2>
          </div>
          <p className="text-sm mt-1">{preferences?.bio || "No bio yet"}</p>
        </div>

        {/* Edit Profile Button*/}
        <button
          onClick={() => navigate("/edit-profile")}
          className={`w-full mt-4 py-1.5 rounded-md font-medium text-sm ${darkMode ? "bg-gray-800 border border-gray-600 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="border-t max-w-4xl mx-auto">
        <div className="flex">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-4 flex justify-center items-center ${activeTab === "posts" ? (darkMode ? "text-white border-t border-white" : "text-black border-t border-black") : (darkMode ? "text-gray-400" : "text-gray-500")}`}
          >
            <AiOutlineBook size={20} className="md:mr-2" />
            <span className="hidden md:inline">Posts</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {errorMessage && (
          <p className={`text-center ${darkMode ? "text-red-400" : "text-red-600"}`}>
            {errorMessage}
          </p>
        )}

        {activeTab === "posts" && (
          <>
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {userPosts.map((post) => (
                  <div
                    key={post._id}
                    className={`relative rounded-lg shadow-md flex flex-col h-full transition duration-300 ${darkMode
                      ? "bg-gray-800 hover:shadow-lg"
                      : "bg-gray-50 hover:shadow-lg"
                      }`}
                  >
                    {/* Post Media */}
                    {post.fileurl && post.filetype.startsWith("image/") ? (
                      <img
                        src={`http://localhost:3000/${post.fileurl}`}
                        alt="Post"
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : post.filetype === "application/pdf" ? (
                      <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <p className="text-lg font-medium text-black">PDF Document</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center p-4 overflow-hidden">
                        <div className="w-full h-full overflow-y-auto">
                          <p className="text-sm text-gray-700 break-words">
                            {post.description || "Text Only Post"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Post Info */}
                    <div className="p-3 flex-grow">
                      <h3
                        className={`text-md font-semibold mb-1 line-clamp-1 ${darkMode ? "text-white" : "text-gray-800"
                          }`}
                      >
                        {post.title || "Untitled Post"}
                      </h3>
                      <p
                        className={`text-xs line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                      >
                        {post.description}
                      </p>
                    </div>

                    {/* Post Stats */}
                    <div
                      className={`px-3 pb-3 flex items-center justify-between ${darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                      <div className="flex items-center">
                        <AiOutlineHeart className="mr-1" />
                        <span className="text-xs">{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <AiOutlineComment className="mr-1" />
                        <span className="text-xs">{post.comments || 0}</span>
                      </div>
                    </div>

                    {/* View Post Button */}
                    <button
                      className={`absolute top-2 right-2 p-2 rounded-full bg-opacity-75 transition ${darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      onClick={() => handleViewPost(post._id)}
                      aria-label="View post"
                    >
                      <FaRegEye size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              user?.isWriter && (
                <div
                  className={`flex flex-col p-3 w-full max-w-2xl mx-auto rounded-xl shadow ${darkMode
                    ? "border border-gray-700 bg-[#2B1D14]"
                    : "border border-warmBrown bg-warmBeige text-warmText"
                    }`}
                >
                  <NewpostUploader />
                </div>
              )
            )}
          </>
        )}
      </div>


      {isViewPostOpen && (
        <ViewPost
          postId={selectedPostId}
          onClose={() => setIsViewPostOpen(false)}
        />
      )}

      {isFollowModalOpen && (
        <FollowListModal
          type={followModalType}
          userId={user._id}
          onClose={closeFollowModal}
          followersCount={followersCount}
          followingCount={followingCount}
        />
      )}
    </div>
  );
}

export default ProfileSinglePage;