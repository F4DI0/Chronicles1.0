import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiOutlineComment, AiOutlineBook } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { useDarkMode } from "../context/DarkModeContext";
import ViewPost from "../components/ViewPost";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUser } from "../context/userContext";
import ProfileFollowButton from "../components/ProfileFollowButton";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { user: currentUser } = useUser();

  const [userData, setUserData] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("posts");
  const [isViewPostOpen, setIsViewPostOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user profile");
      const data = await res.json();
      console.log(data)
      setUserData(data.user);
      setPreferences(data.preferences || {});
      setFollowersCount(data.followers || 0);
      setFollowingCount(data.following || 0);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load user profile");
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}/posts`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setUserPosts(data.data || []);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load posts");
    }
  };

  const handleViewPost = (postId) => {
    setSelectedPostId(postId);
    setIsViewPostOpen(true);
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchUserInfo(), fetchUserPosts()]);
      setLoading(false);
    };
    loadAll();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!userData) return <div className="flex justify-center items-center min-h-[50vh]">User not found</div>;

  return (
    <div className={`min-h-screen w-full transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className={`sticky top-0 z-10 p-4 border-b ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center mt-10 justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">{userData.username || "username"}</h1>
          {currentUser?._id === id && (
            <button
              onClick={() => navigate("/settings")}
              className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <FiSettings size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-warmBrown">
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

          <div className="flex-1 flex justify-between">
            <div className="text-center">
              <p className="font-bold">{userPosts.length}</p>
              <p className="text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{followersCount}</p>
              <p className="text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{followingCount}</p>
              <p className="text-sm">Following</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex gap-2">
            <h2 className="font-bold">{userData.firstname || "First Name"}</h2>
            <h2 className="font-bold">{userData.lastname || "Last Name"}</h2>
          </div>
          <p className="text-sm mt-1">{preferences?.bio || "No bio yet"}</p>
        </div>

        {currentUser?._id === id ? (
          <button
            onClick={() => navigate("/edit-profile")}
            className={`w-full mt-4 py-1.5 rounded-md font-medium text-sm ${darkMode ? "bg-gray-800 border border-gray-600 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Edit Profile
          </button>
        ) : (
          <ProfileFollowButton profileUserId={id} />
        )}
      </div>

      <div className="border-t max-w-4xl mx-auto">
        <div className="flex">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-4 flex justify-center items-center ${activeTab === "posts" ? darkMode ? "text-white border-t border-white" : "text-black border-t border-black" : darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            <AiOutlineBook size={20} className="md:mr-2" />
            <span className="hidden md:inline">Posts</span>
          </button>
        </div>
      </div>

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
                    className={`relative rounded-lg shadow-md flex flex-col h-full transition duration-300 ${darkMode ? "bg-gray-800 hover:shadow-lg" : "bg-gray-50 hover:shadow-lg"}`}
                  >
                    {post.fileurl && post.filetype?.startsWith("image/") ? (
                      <img
                        src={`http://localhost:3000/${post.fileurl}`}
                        alt="Post"
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : post.filetype === "application/pdf" ? (
                      <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                        <p className="text-lg font-medium text-black">PDF Document</p>
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

                    <div className="p-3 flex-grow">
                      <h3 className={`text-md font-semibold mb-1 line-clamp-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {post.title || "Untitled Post"}
                      </h3>
                      <p className={`text-xs line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {post.description}
                      </p>
                    </div>

                    <div className={`px-3 pb-3 flex items-center justify-between ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <div className="flex items-center">
                        <AiOutlineHeart className="mr-1" />
                        <span className="text-xs">{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <AiOutlineComment className="mr-1" />
                        <span className="text-xs">{post.comments || 0}</span>
                      </div>
                    </div>

                    <button
                      className={`absolute top-2 right-2 p-2 rounded-full bg-opacity-75 transition ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                      onClick={() => handleViewPost(post._id)}
                      aria-label="View post"
                    >
                      <FaRegEye size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center mt-10 text-sm text-gray-500">No posts to display.</p>
            )}
          </>
        )}
      </div>

      {isViewPostOpen && (
        <ViewPost postId={selectedPostId} onClose={() => setIsViewPostOpen(false)} />
      )}
    </div>
  );
}

export default UserProfile;
