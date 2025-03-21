import { AiOutlineHeart } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDarkMode } from "../context/DarkModeContext";

function ViewPost({ postId, onClose }) {
  const { darkMode } = useDarkMode();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Fetch post data including comments
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }
        const data = await response.json();
        setPost(data);
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching post data:", error);
        alert("Failed to load post. Please try again.");
      }
    };
    fetchPostData();
  }, [postId]);

  // Handle Comment Submission
  const handleComment = async (e) => {
    e.preventDefault();

    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ comment: trimmedComment }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Comment created:", data);
        setCommentText("");
        const updatedComments = await fetchComments(postId);
        setComments(updatedComments);
      } else {
        alert("Failed to create comment. Please try again.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching comments:', errorText);
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("Failed to fetch comments. Please try again.");
      return [];
    }
  };

  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full lg:w-4/5 xl:w-3/4 h-full lg:h-auto lg:max-h-[90vh] rounded-lg shadow-lg flex flex-col lg:flex-row overflow-hidden transition-all duration-300 ${
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

        {/* Left Side - Post Content */}
        <div className="w-full lg:w-2/3 p-4 lg:p-6 flex flex-col overflow-y-auto">
          <h2 className={`text-lg lg:text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-warmBrown"}`}>
            {post.title}
          </h2>

          {post.filetype === 'application/pdf' ? (
            <iframe
              src={"http://localhost:3000/" + post.fileurl}
              className="w-full h-[300px] lg:h-[500px] rounded-xl shadow-lg"
              title="PDF Viewer"
            />
          ) : post.filetype?.startsWith('image/') ? (
            <img
              src={"http://localhost:3000/" + post.fileurl}
              alt="post"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          ) : null}
        </div>

        {/* Right Side - Comments Section */}
        <div
          className={`w-full lg:w-1/3 p-4 lg:p-6 border-t lg:border-l flex flex-col overflow-y-auto max-h-[50vh] lg:max-h-[80vh] transition-all duration-300 ${
            darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-warmBeige border-warmBrown text-warmText"
          }`}
        >
          {/* Author Info */}
          <div className="flex items-center mb-4">
            <img
              src={post.author?.photoURL || "/user.png"}
              alt="userPic"
              className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 ${
                darkMode ? "border-gray-500" : "border-warmBrown"
              }`}
            />
            <div className="ml-3">
              <h3 className={`text-sm lg:text-base font-semibold ${darkMode ? "text-white" : "text-warmBrown"}`}>
                {post.author?.username || "Unknown Name"}
              </h3>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-warmText"}`}>
                {post.author?.email || "Unknown Email"}
              </p>
            </div>
          </div>

          {/* Comment Input */}
          <h3 className={`text-sm lg:text-base font-bold mb-3 ${darkMode ? "text-white" : "text-warmBrown"}`}>
            Comments
          </h3>
          <form onSubmit={handleComment} className="mb-4">
            <input
              type="text"
              placeholder="Write a comment..."
              className={`w-full p-2 rounded-md text-xs lg:text-sm transition ${
                darkMode ? "bg-gray-700 text-white" : "bg-warmBeige text-warmText border border-warmBrown"
              }`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 bg-blue-600 px-4 py-2 rounded-md w-full text-white text-xs lg:text-sm"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className={`text-xs text-gray-400 ${darkMode ? "" : "text-warmBrown"}`}>
                No comments yet.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className={`p-2 lg:p-3 rounded-md transition ${
                    darkMode ? "bg-gray-800 text-white" : "bg-warmBeige border border-warmBrown text-warmText"
                  }`}
                >
                  <p className="text-xs font-bold">{comment.author?.username || "Unknown User"}</p>
                  <p className="text-xs break-words overflow-wrap-break-word max-w-full">
                    {comment.comment}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(comment.date).toLocaleString()}
                  </p>
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