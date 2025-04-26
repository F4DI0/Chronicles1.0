import PropTypes from 'prop-types';
import { AiOutlineComment, AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { useUser } from '../context/userContext';
import { IoIosSend } from "react-icons/io";
import { FaRegCommentDots, FaRegEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ViewPost from './ViewPost';
import Repost from './Repost'; // We'll create this component next
import RepostPost from './RepostPost';

function SinglePost(props) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [reposts, setReposts] = useState(0);
  const [showFullText, setShowFullText] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isViewPostOpen, setIsViewPostOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [authorProfilePic, setAuthorProfilePic] = useState(null);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [authorData, setAuthorData] = useState(false);
  const [repostComment, setRepostComment] = useState("");
  const { user } = useUser();
  const [post, setPost] = useState({});
  const navigate = useNavigate();

  const postId = props.postId;

  // Fetch post data including comments
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error fetching post data:', errorText);
          throw new Error('Failed to fetch post data');
        }
        const data = await response.json();
        setLikes(data.likesCount || 0);
        setLiked(data.isLiked || false);
        setComments(data.comments || []);
        setPost(data || {});
        setReposts(data.repostCount || 0);
  
        if (data.author?._id) {
          const authorResponse = await fetch(`http://localhost:3000/users/${data.author._id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
  
          if (authorResponse.ok) {
            const authorDataFetched = await authorResponse.json();
            setAuthorData(authorDataFetched.user); // 🛠️ This is where your ID, username are!
            if (authorDataFetched.preferences?.profilepic) {
              setAuthorProfilePic(`http://localhost:3000/${authorDataFetched.preferences.profilepic}`);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        alert("Failed to fetch post data. Please try again.");
      }
    };
    fetchPostData();
  }, [postId]);
  

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        alert("Post deleted successfully!");
        if (props.onDelete) {
          props.onDelete(postId);
        }
      } else {
        const errorText = await response.text();
        console.error("Error deleting post:", errorText);
        alert("Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error handling post deletion:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.isLiked);
        setLikes(data.likesCount);
      } else {
        const errorText = await response.text();
        console.error("Error liking/unliking the post:", errorText);
        alert("Failed to like/unlike the post. Please try again.");
      }
    } catch (error) {
      console.error("Error handling like/unlike:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleRepost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}/repost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title: repostComment }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Post reposted successfully!");
        setIsRepostModalOpen(false);
        setRepostComment("");
        // Update Reposts count
        setReposts(data.repostCount);
      } else {
        const errorText = await response.text();
        console.error("Error reposting:", errorText);
        alert("Failed to repost. Please try again.");
      }
    } catch (error) {
      console.error("Error handling repost:", error);
      alert("An error occurred. Please try again.");
    }
  };

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
        setCommentText("");
        const updatedComments = await fetchComments(postId);
        setComments(updatedComments);
      } else {
        const errorText = await response.text();
        console.error("Error creating comment:", errorText);
        alert("Failed to create comment. Please try again.");
      }
    } catch (error) {
      console.error("Error handling comment:", error);
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
      return data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("Failed to fetch comments. Please try again.");
      return [];
    }
  };

  const isImageFile = (filetype) => {
    return filetype && filetype.startsWith('image/');
  };

  const isPdfFile = (filetype) => {
    return filetype === 'application/pdf';
  };

  const handleViewPost = (postId) => {
    setSelectedPostId(postId);
    setIsViewPostOpen(true);
  };

  // If this is a repost, render the Repost component instead
  // Modify the condition for displaying repost content
  if (post.repost && post.repostData) {
    return (
      <div className="repost-container">
        {/* Add any additional styling to differentiate reposts */}
        <div className="repost-header">
          Reposted by {post.repostData.repostedBy?.username || "Unknown User"}
        </div>
        <RepostPost repost={post} /> {/* Pass repost data */}
      </div>
    );
  }

  return (
    <div className="bg-[#4E3728] w-full ml-10 max-w-4xl mx-auto px-4 py-3 my-4 rounded-3xl flex flex-col shadow-md">
      {/* Post content */}
      <div className="w-full flex items-center justify-between my-2 px-3">
        <div className="flex items-center">
          <img
            src={authorProfilePic || "/user.png"}
            alt="userPic"
            className="lg:w-10 lg:h-10 w-8 h-8 rounded-2xl object-cover border-2 border-gray-500 cursor-pointer"
            onClick={() => navigate(`/user/${authorData?._id}`)}  
            onError={(e) => {
              e.target.src = "/user.png";
            }}
          />

          <div className="ml-2">
            <h3 className="text-white text-xs font-semibold cursor-pointer" onClick={() => navigate(`/user/${authorData?._id}`)}>
              {post.author?.email || "Unknown Email"}
            </h3>
            <h3 className="text-white text-xs lg:text-sm font-semibold flex items-center">
              {post.author?.username || "Unknown Name"}
              <span className="mx-2 text-xs text-gray-400">
                {new Date(post.date).toLocaleDateString()} - {new Date(post.date).toLocaleTimeString()}
              </span>
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user?._id === post.author?._id && (
            <FaTrash
              fontSize={16}
              className="text-red-500 cursor-pointer hover:text-red-700 transition"
              onClick={handleDeletePost}
              title="Delete post"
            />
          )}
          <FaRegEye
            fontSize={20}
            className="text-white cursor-pointer hover:text-gray-400 transition"
            onClick={() => handleViewPost(post._id)}
          />
        </div>
      </div>

      {/* Post title */}
      <div className="text-white text-[10px] lg:text-sm w-full px-5 my-2 font-light tracking-wider">
        <div
          className={`overflow-y-auto max-h-32 ${showFullText ? "" : "line-clamp-3"}`}
          style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        >
          {post.title}
        </div>
        {post.title?.length > 150 && (
          <button
            className="text-blue-400 ml-2 text-xs cursor-pointer"
            onClick={() => setShowFullText(!showFullText)}
          >
            {showFullText ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* Post file (image or PDF) */}
      {post.fileurl && (
        <div className="w-full object-cover px-5 my-4">
          {isImageFile(post.filetype) ? (
            <img
              src={"http://localhost:3000/" + post.fileurl}
              alt="post"
              className="w-full h-auto object-cover rounded-2xl shadow-lg cursor-pointer"
              onClick={() => setIsImageOpen(true)}
            />
          ) : isPdfFile(post.filetype) ? (
            <object
              data={"http://localhost:3000/" + post.fileurl}
              type="application/pdf"
              width="100%"
              height="500px"
              className="rounded-2xl shadow-lg"
            >
              <p>Your browser does not support PDFs. <a href={"http://localhost:3000/" + post.fileurl}>Download the PDF</a>.</p>
            </object>
          ) : (
            <p>Unsupported file type</p>
          )}
        </div>
      )}

      {/* Like, Comment, Repost buttons */}
      <div className="w-full flex items-center justify-start text-white px-5 my-1 border-b border-gray-500 py-3">
        <button
          className={`flex items-center cursor-pointer ${liked ? "text-red-500" : "text-white"}`}
          onClick={handleLike}
        >
          <AiOutlineHeart fontSize={19} className="mx-2" />
          <p className="text-xs">{likes}</p>
        </button>
        <div className="flex items-center cursor-pointer" onClick={() => setShowComments(!showComments)}>
          <AiOutlineComment fontSize={19} className="mx-2" />
          <p className="text-xs">{comments.length}</p>
        </div>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsRepostModalOpen(true)}
        >
          <AiOutlineRetweet fontSize={19} className="mx-2" />
          <p className="text-xs">{reposts}</p>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="my-2">
          <form className="flex justify-between px-3 py-2" onSubmit={handleComment}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full text-white text-sm bg-[#4E3728] p-2 rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              className="text-blue-500 font-semibold"
              disabled={!commentText.trim()}
            >
              Post
            </button>
          </form>

          <div className="comments-section max-h-64 overflow-y-auto px-3">
            {comments.slice(0, showAllComments ? comments.length : 3).map((comment, index) => (
              <div key={comment._id || index} className="comment-item text-white text-sm p-2 border-b border-gray-600">
                <p className="break-words overflow-wrap-break-word max-w-full">
                  {comment.comment}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  - {comment.author?.username || "Unknown User"} ({new Date(comment.date).toLocaleString()})
                </p>
              </div>
            ))}

            {comments.length > 3 && !showAllComments && (
              <button
                className="text-blue-400 text-xs cursor-pointer my-2"
                onClick={() => setShowAllComments(true)}
              >
                Show All Comments
              </button>
            )}
          </div>
        </div>
      )}

      {/* Image modal */}
      {isImageOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setIsImageOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={"http://localhost:3000/" + post.fileurl}
              alt="post"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl cursor-pointer"
              onClick={() => setIsImageOpen(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Repost modal */}
      {isRepostModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#4E3728] rounded-lg p-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-lg mb-4">Repost this post</h3>
            <textarea
              placeholder="Add your comment (optional)"
              value={repostComment}
              onChange={(e) => setRepostComment(e.target.value)}
              className="w-full bg-[#3E2A1F] text-white p-3 rounded-lg mb-4"
              rows={3}
            />
            <div className="preview mb-4 p-3 bg-[#3E2A1F] rounded-lg">
              <div className="text-white text-sm">
                <div className="flex items-center mb-2">
                  <img
                    src={authorProfilePic || "/user.png"}
                    alt="userPic"
                    className="w-8 h-8 rounded-full object-cover border border-gray-500"
                  />
                  <span className="ml-2">{post.author?.username || "Unknown User"}</span>
                </div>
                <p className="text-xs line-clamp-2">{post.title}</p>
                {post.fileurl && isImageFile(post.filetype) && (
                  <img
                    src={"http://localhost:3000/" + post.fileurl}
                    alt="preview"
                    className="w-full mt-2 rounded-lg max-h-40 object-contain"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-white bg-gray-600 rounded-lg"
                onClick={() => setIsRepostModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded-lg"
                onClick={handleRepost}
              >
                Repost
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewPostOpen && (
        <ViewPost
          postId={selectedPostId}
          onClose={() => setIsViewPostOpen(false)}
        />
      )}
    </div>
  );
}

SinglePost.propTypes = {
  postId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default SinglePost;