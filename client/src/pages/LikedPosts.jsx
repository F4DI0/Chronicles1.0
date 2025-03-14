import { useState, useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import ViewPost from "../components/ViewPost";

function LikedPosts() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch liked posts from the backend
    fetch("http://localhost:3000/posts/likedposts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure session cookie is sent with the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch liked posts");
        }
        return response.json();
      })
      .then((data) => {
        setLikedPosts(data); // Set the liked posts in the state
      })
      .catch((error) => {
        console.error("Error fetching liked posts:", error);
        setErrorMessage("An error occurred. Please try again.");
      });
  }, []);

  const handleViewPost = (post) => {
    setSelectedPost(post); // Open post for viewing
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3E2723] to-[#5D4037] text-white transition-all duration-300 ${
        darkMode ? "bg-[#2B1D14]" : "bg-warmBeige text-warmText"
      }`}
    >
      <div className="bg-[#F5E6C8] text-[#3E2723] w-full max-w-6xl p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">📖 Liked Posts</h2>

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {likedPosts.length > 0 ? (
            likedPosts.map((post) => (
              <div
                key={post._id} // Use post._id as the key
                className={`relative p-4 rounded-lg shadow-md flex flex-col justify-between overflow-hidden transition duration-300 ${
                  darkMode
                    ? "bg-[#1f1410] text-white hover:shadow-lg"
                    : "bg-warmBeige text-warmText border border-warmBrown hover:shadow-lg"
                }`}
              >
                {/* Post Media */}
                {post.fileurl && post.filetype.startsWith("image/") ? (
                  <img
                    src={`http://localhost:3000/${post.fileurl}`}
                    alt="Post"
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                ) : post.filetype === "application/pdf" ? (
                  <div className="w-full relative">
                    <iframe
                      src={`http://localhost:3000/${post.fileurl}`}
                      className="w-full h-48 rounded-md"
                      title="PDF Preview"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center rounded-md mb-2 bg-gray-700">
                    <p className="text-sm text-gray-300">
                      {post.title?.trim() ? post.title : "Text Only Post"}
                    </p>
                  </div>
                )}

                {/* Post Info */}
                <h3
                  className={`text-md font-semibold truncate ${
                    darkMode ? "text-white" : "text-warmBrown"
                  }`}
                >
                  {post.title}
                </h3>
                <p
                  className={`text-xs truncate ${
                    darkMode ? "text-gray-400" : "text-warmText"
                  }`}
                >
                  {post.description}
                </p>

                {/* View Post Button */}
                <button
                  className={`absolute top-2 right-2 p-1 rounded-full bg-opacity-75 transition ${
                    darkMode
                      ? "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                      : "bg-warmBrown text-warmBeige hover:bg-[#A07355] hover:text-warmText"
                  }`}
                  onClick={() => handleViewPost(post)}
                >
                  <FaRegEye fontSize={20} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-red-600 col-span-4">
              No liked posts yet.
            </p>
          )}
        </div>
      </div>

      {/* ViewPost Modal */}
      {selectedPost && <ViewPost post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
}

export default LikedPosts;