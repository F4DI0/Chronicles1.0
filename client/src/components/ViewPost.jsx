import { AiOutlineHeart } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { useState } from "react";
import { useDarkMode } from "../context/DarkModeContext"; // ✅ Import Dark Mode

function ViewPost({ post, onClose }) {
  if (!post) return null;

  const { darkMode } = useDarkMode(); // ✅ Use Dark Mode State

  // State for comments and input field
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Handle Comment Submission
  const handleComment = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (commentText.trim() !== "") {
      const newComment = {
        id: Date.now(),
        text: commentText,
        userName: "Current User",
      };
      setComments([newComment, ...comments]); // Add comment to top
      setCommentText(""); // Clear input field
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div
        className={`w-11/12 lg:w-3/4 rounded-lg shadow-lg flex overflow-hidden max-h-[90vh] transition-all duration-300 ${
          darkMode ? "bg-[#4E3728]" : "bg-warmBeige text-warmText"
        }`}
      >
        {/* Close Button */}
        <button
          className={`absolute top-4 right-4 text-3xl cursor-pointer transition ${
            darkMode ? "text-white hover:text-gray-300" : "text-warmBrown hover:text-warmText"
          }`}
          onClick={onClose}
        >
          ✖
        </button>

        {/* Left: Post Content */}
        <div className="w-2/3 p-6 flex flex-col sticky top-0 h-full overflow-hidden">
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-warmBrown"}`}>
            {post.disc}
          </h2>

          {/* Show Image or PDF */}
          {post.pdfURL ? (
            <iframe
              src={post.pdfURL}
              className="w-full h-[500px] rounded-xl shadow-lg"
              title="PDF Viewer"
            />
          ) : post.imageURL ? (
            <img
              src={post.imageURL}
              alt="post"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          ) : null}
        </div>

        {/* Right: Scrollable Comments Section */}
        <div
          className={`w-1/3 p-6 border-l flex flex-col overflow-y-auto max-h-[80vh] transition-all duration-300 ${
            darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-warmBeige border-warmBrown text-warmText"
          }`}
        >
          {/* User Info */}
          <div className="flex items-center mb-6">
            <img
              src={post.photoURL || "/user.png"}
              alt="userPic"
              className={`w-14 h-14 rounded-full border-2 ${
                darkMode ? "border-gray-500" : "border-warmBrown"
              }`}
            />
            <div className="ml-4">
              <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-warmBrown"}`}>
                {post.displayName}
              </h3>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-warmText"}`}>
                {post.useEmail}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <h3 className={`text-lg font-bold mb-3 ${darkMode ? "text-white" : "text-warmBrown"}`}>
            Comments
          </h3>
          <form onSubmit={handleComment} className="mb-4">
            <input
              type="text"
              placeholder="Write a comment..."
              className={`w-full p-2 rounded-md transition ${
                darkMode ? "bg-gray-700 text-white" : "bg-warmBeige text-warmText border border-warmBrown"
              }`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 bg-blue-600 px-4 py-2 rounded-md w-full text-white"
            >
              Post Comment
            </button>
          </form>

          {/* Scrollable Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className={`text-gray-400 ${darkMode ? "" : "text-warmBrown"}`}>No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-md transition ${
                    darkMode ? "bg-gray-800 text-white" : "bg-warmBeige border border-warmBrown text-warmText"
                  }`}
                >
                  <p className="text-sm font-bold">{comment.userName}</p>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPost;
