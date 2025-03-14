import PropTypes from 'prop-types';
import { AiOutlineHeart } from "react-icons/ai";
import { IoIosSend, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaRegCommentDots, FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function SinglePost(props) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [shares, setShares] = useState(0);
  const [showFullText, setShowFullText] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isViewPostOpen, setIsViewPostOpen] = useState(false);
  const [post, setPost] = useState({});
  const navigate = useNavigate();

  const postId = props.postId;

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
          const errorText = await response.text();
          console.error('Error fetching post data:', errorText);
          throw new Error('Failed to fetch post data');
        }
        const data = await response.json();
        console.log("Fetched post data:", data);
        setLikes(data.likesCount || 0);
        setLiked(data.isLiked || false);
        setComments(data.comments || []);
        setPost(data || {});
      } catch (error) {
        console.error("Error fetching post data:", error);
        alert("Failed to fetch post data. Please try again.");
      }
    };
    fetchPostData();
  }, [postId]);

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
        console.log("Like/unlike response:", data);
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

  const handleComment = async (e) => {
    e.preventDefault();
    const trimmedComment = commentText.trim(); // Trim whitespace
    if (trimmedComment !== "") {
      try {
        const payload = { text: trimmedComment };
        console.log("Sending payload:", payload); // Log the payload
  
        const response = await fetch(`http://localhost:3000/posts/${postId}/comment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });
  
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []);
          setCommentText("");
        } else {
          const errorText = await response.text();
          console.error("Error submitting comment:", errorText);
          alert("Failed to submit comment. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Comment cannot be empty!");
    }
  };

  const handleShare = async () => {
    setShares(shares + 1);
    alert("Post shared! (Just frontend simulation)");
  };

  const isImageFile = (filetype) => {
    return filetype && filetype.startsWith('image/');
  };

  const isPdfFile = (filetype) => {
    return filetype === 'application/pdf';
  };

  return (
    <div className="bg-[#4E3728] w-full lg:px-4 py-3 my-4 rounded-3xl flex flex-col shadow-md">
      <div className="w-full flex items-center justify-between my-2 px-3">
        <div className="flex items-center">
          <img
            src={post.author?.photoURL || "/user.png"}
            alt="userPic"
            className="lg:w-10 lg:h-10 w-8 h-8 rounded-2xl object-cover border-2 border-gray-500 cursor-pointer"
            onClick={() => navigate(`/userProfile/${post.author?._id}`)}
          />
          <div className="ml-2">
            <h3 className="text-white text-xs font-semibold cursor-pointer" onClick={() => navigate(`/userProfile/${post.author?._id}`)}>
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
        <FaRegEye
          fontSize={20}
          className="text-white cursor-pointer hover:text-gray-400 transition"
          onClick={() => setIsViewPostOpen(true)}
        />
      </div>

      <div className="text-white text-[10px] lg:text-sm w-full px-5 my-2 font-light tracking-wider">
        {showFullText ? post.title : `${post.title?.slice(0, 150)}${post.title?.length > 150 ? "..." : ""}`}
        {post.title?.length > 150 && (
          <button className="text-blue-400 ml-2 text-xs cursor-pointer" onClick={() => setShowFullText(!showFullText)}>
            {showFullText ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

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

      <div className="w-full flex items-center justify-start text-white px-5 my-1 border-b border-gray-500 py-3">
        <button
          className={`flex items-center cursor-pointer ${liked ? "text-red-500" : "text-white"}`}
          onClick={handleLike}
        >
          <AiOutlineHeart fontSize={19} className="mx-2" />
          <p className="text-xs">{likes}</p>
        </button>
        <div className="flex items-center cursor-pointer" onClick={() => setShowComments(!showComments)}>
          <FaRegCommentDots fontSize={19} className="mx-2" />
          <p className="text-xs">{comments.length}</p>
        </div>
        <div className="flex items-center cursor-pointer" onClick={handleShare}>
          <IoIosSend fontSize={19} className="mx-2" />
          <p className="text-xs">{shares}</p>
        </div>
      </div>

      {showComments && (
  <div className="my-2">
    {/* Comment Input Form */}
<form className="flex justify-between px-3 py-2" onSubmit={handleComment}>
  <input
    type="text"
    placeholder="Add a comment..."
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    className="w-full text-white text-sm bg-[#4E3728] p-2 rounded-lg focus:outline-none"
  />
  <button type="submit" className="text-blue-500 font-semibold">
    Post
  </button>
</form>

{/* Display Comments */}
<div className="comments-section max-h-64 overflow-y-auto">
  {comments.slice(0, showAllComments ? comments.length : 3).map((comment, index) => (
    <div key={comment._id || index} className="comment-item text-white text-sm p-2 border-b border-gray-600">
      <p>{comment.text}</p>
      <p className="text-xs text-gray-400">
        - {comment.author?.username || "Unknown User"} ({new Date(comment.date).toLocaleString()})
      </p>
    </div>
  ))}

  {/* Show All Comments Button */}
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

      {isImageOpen && (
        <div className="modal" onClick={() => setIsImageOpen(false)}>
          <img
            src={"http://localhost:3000/" + post.fileurl}
            alt="post"
            className="w-full max-h-[90vh] object-contain"
          />
        </div>
      )}

      {isViewPostOpen && (
        <div className="modal" onClick={() => setIsViewPostOpen(false)}>
          <div className="post-detail-content">
          </div>
        </div>
      )}
    </div>
  );
}

SinglePost.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default SinglePost;