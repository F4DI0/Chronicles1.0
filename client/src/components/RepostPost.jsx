import React, { useState, useEffect } from "react";
import { AiOutlineRetweet, AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { useUser } from '../context/userContext';
import { useNavigate } from "react-router-dom";
import { IoIosSend } from "react-icons/io";
import SinglePost from "./SinglePost";

function RepostPost({ repost, onDelete }) {
  const [likes, setLikes] = useState(repost.likesCount || 0);
  const [liked, setLiked] = useState(repost.isLiked || false);
  const [comments, setComments] = useState(repost.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [authorProfilePic, setAuthorProfilePic] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  // Fetch comments when component mounts or when showComments changes
  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments();
    }
  }, [showComments]);

  // Fetch author's profile picture
  useEffect(() => {
    const fetchAuthorProfilePic = async () => {
      if (repost.author?._id) {
        try {
          const response = await fetch(`http://localhost:3000/users/${repost.author._id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            if (data.preferences?.profilepic) {
              setAuthorProfilePic(`http://localhost:3000/${data.preferences.profilepic}`);
            }
          }
        } catch (error) {
          console.error("Error fetching author profile picture:", error);
        }
      }
    };

    fetchAuthorProfilePic();
  }, [repost.author?._id]);

  const fetchComments = async () => {
    setIsFetchingComments(true);
    try {
      const response = await fetch(`http://localhost:3000/posts/${repost._id}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsFetchingComments(false);
    }
  };

  // const handleLike = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/posts/${repost._id}/like`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setLiked(data.isLiked);
  //       setLikes(data.likesCount);
  //     }
  //   } catch (error) {
  //     console.error("Error liking/unliking the post:", error);
  //   }
  // };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this repost?")) return;
    try {
      const response = await fetch(`http://localhost:3000/posts/${repost._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok && onDelete) {
        onDelete(repost._id);
      }
    } catch (error) {
      console.error("Error handling post deletion:", error);
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
      const response = await fetch(`http://localhost:3000/posts/${repost._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ comment: trimmedComment }),
      });
      
      if (response.ok) {
        setCommentText("");
        await fetchComments(); // Refresh comments after posting
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

  return (
    <div className="bg-[#4E3728] w-full ml-10 max-w-4xl mx-auto px-4 py-3 my-4 rounded-3xl flex flex-col shadow-md">
      {/* Repost header */}
      <div className="flex items-center justify-between px-3 py-2 mb-2">
        <div className="flex items-center space-x-2">
          <AiOutlineRetweet className="text-gray-300" />
          <div className="flex items-center">
            <img
              src={authorProfilePic || "/user.png"}
              alt="profile"
              className="w-6 h-6 rounded-full mr-2 cursor-pointer"
              onClick={() => navigate(`/userProfile/${repost.author?._id}`)}
              onError={(e) => { e.target.src = "/user.png" }}
            />
            <span 
              className="text-gray-300 text-sm font-medium cursor-pointer hover:underline"
              onClick={() => navigate(`/userProfile/${repost.author?._id}`)}
            >
              {repost.author?.username || "User"} reposted
            </span>
          </div>
        </div>
        <span className="text-gray-400 text-xs">
          {new Date(repost.date).toLocaleString()}
        </span>
      </div>

      {/* Reposter's comment */}
      {repost.title && (
        <div className="text-white px-5 py-3 mb-3 bg-[#3E2A1F]/70 rounded-lg">
          <p className="text-1xl whitespace-pre-wrap">{repost.title}</p>
        </div>
      )}

      {/* Original post */}
      <div className="bg-[#3E2A1F]/60 rounded-xl w-full flex justify-center items-center px-4 mb-3">
        <SinglePost 
          postId={repost.repostData?.originalPostId}
          style={{ 
            backgroundColor: 'transparent',
            margin: 0,
            padding: 0,
            border: "none",
            boxShadow: 'none'
          }}
          disableInteractions={true}
          compactMode={true}
        />
      </div>

      {/* Interaction buttons */}
      <div className="flex items-center justify-start text-white px-5 my-1 border-t border-gray-500 pt-3">
       
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => setShowComments(!showComments)}
        >
          <AiOutlineComment fontSize={19} className="mx-2" />
          <p className="text-xs">{comments.length}</p>
        </div>
        {user?._id === repost.author?._id && (
          <FaTrash
            fontSize={16}
            className="text-red-500 cursor-pointer hover:text-red-700 transition ml-4"
            onClick={handleDeletePost}
            title="Delete repost"
          />
        )}
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-600">
          <form onSubmit={handleComment} className="flex px-3 mb-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-[#3E2A1F] text-white text-sm p-2 rounded-l-lg focus:outline-none"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-3 rounded-r-lg text-sm flex items-center justify-center"
              disabled={!commentText.trim()}
            >
              <IoIosSend className="mr-1" />
              Post
            </button>
          </form>

          {isFetchingComments ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              {comments.slice(0, showAllComments ? comments.length : 3).map((comment) => (
                <div key={comment._id} className="px-3 py-2 border-b border-gray-700">
                  <div className="flex items-start">
                    <img
                      src={comment.author?.profilePic || "/user.png"}
                      alt="profile"
                      className="w-6 h-6 rounded-full mr-2 mt-1"
                      onError={(e) => { e.target.src = "/user.png" }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white text-sm font-medium mr-2">
                            {comment.author?.username || "Unknown"}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {new Date(comment.date).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-white text-sm mt-1 whitespace-pre-wrap break-words">
                        {comment.text || comment.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length > 3 && !showAllComments && (
                <button
                  className="text-blue-400 text-xs cursor-pointer my-2 ml-3"
                  onClick={() => setShowAllComments(true)}
                >
                  Show all comments ({comments.length - 3} more)
                </button>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-3 text-sm">No comments yet</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RepostPost;