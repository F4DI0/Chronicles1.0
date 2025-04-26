// Repost.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RepostPost from './RepostPost';

function Repost({ repost }) {
  const [originalPost, setOriginalPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOriginalPost = async () => {
      try {
        if (repost.repostData?.originalContent) {
          setOriginalPost({
            ...repost.repostData,
            _id: repost.repostData.originalPostId,
            author: repost.repostData.originalAuthor,
          });
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:3000/posts/${repost.repostData.originalPostId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch original post');
        }

        const data = await response.json();
        setOriginalPost(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching original post:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (repost.repostData?.originalPostId) {
      fetchOriginalPost();
    } else {
      setLoading(false);
    }
  }, [repost]);

  if (loading) {
    return <div className="p-4 text-white">Loading repost...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading repost: {error}</div>;
  }

  return (
    <div className="w-full p-4">
      <RepostPost repost={repost} originalPost={originalPost} />
    </div>
  );
}

export default Repost;
