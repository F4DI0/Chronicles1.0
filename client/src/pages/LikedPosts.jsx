import { useState, useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { useDarkMode } from "../context/DarkModeContext";
import ViewPost from "../components/ViewPost";
import LoadingSpinner from "../components/LoadingSpinner";

function LikedPosts() {
  const { darkMode } = useDarkMode();
  const [likedPosts, setLikedPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isViewPostOpen, setIsViewPostOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/posts/likedposts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch liked posts");
        }
        return response.json();
      })
      .then((data) => {
        setLikedPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching liked posts:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleViewPost = (postId) => {
    setSelectedPostId(postId);
    setIsViewPostOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className={`min-h-screen py-8 px-4 bg-gradient-to-b from-[#3E2723] to-[#5D4037] text-white transition-all duration-300 ${
        darkMode ? "bg-[#2B1D14]" : "bg-warmBeige text-warmText"
      }`}
    >
      <div className="bg-[#F5E6C8] text-[#3E2723] w-full max-w-6xl mx-auto p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">📖 Liked Posts</h2>

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {likedPosts.length > 0 ? (
            likedPosts.map((post) => (
              <div
                key={post._id}
                className={`relative p-4 rounded-lg shadow-md flex flex-col h-full transition duration-300 ${
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
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                ) : post.filetype === "application/pdf" ? (
                  <div className="w-full h-48 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                    <iframe
                      src={`http://localhost:3000/${post.fileurl}`}
                      className="w-full h-full rounded-md"
                      title="PDF Preview"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center p-4 overflow-hidden">
                    <div className="w-full h-full overflow-y-auto">
                      <p className="text-sm text-gray-700 break-words">
                        {post.description || "Text Only Post"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Post Info */}
                <div className="flex-grow">
                  <h3
                    className={`text-md font-semibold mb-2 line-clamp-2 ${
                      darkMode ? "text-white" : "text-warmBrown"
                    }`}
                  >
                    {post.title || "Untitled Post"}
                  </h3>
                  {post.fileurl && (
                    <p
                      className={`text-xs line-clamp-3 ${
                        darkMode ? "text-gray-400" : "text-warmText"
                      }`}
                    >
                      {post.description}
                    </p>
                  )}
                </div>

                {/* View Post Button */}
                <button
                  className={`absolute top-2 right-2 p-1 rounded-full bg-opacity-75 transition ${
                    darkMode
                      ? "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                      : "bg-warmBrown text-warmBeige hover:bg-[#A07355] hover:text-warmText"
                  }`}
                  onClick={() => handleViewPost(post._id)}
                  aria-label="View post"
                >
                  <FaRegEye fontSize={20} />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-4 py-8 text-center">
              <p className="text-lg text-gray-600">
                You haven't liked any posts yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {isViewPostOpen && (
        <ViewPost
          postId={selectedPostId}
          onClose={() => setIsViewPostOpen(false)}
        />
      )}
    </div>
  );
}

export default LikedPosts;