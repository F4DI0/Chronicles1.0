import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

function ProfileFollowButton({ profileUserId }) {
  const { user } = useUser();
  const [isFollowing, setIsFollowing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check initial follow status
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/follow-status/${profileUserId}`,
          { credentials: 'include' }
        );

        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data.isFollowing);
        } else {
          console.error('Failed to fetch follow status');
        }
      } catch (err) {
        console.error('Error fetching follow status:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    if (user?._id && profileUserId) {
      fetchFollowStatus();
    } else {
      setIsInitializing(false);
    }
  }, [user, profileUserId]);

  const handleFollowAction = async () => {
    if (!user || user._id === profileUserId || isLoading || isInitializing) return;

    const newFollowState = !isFollowing;
    setIsLoading(true);
    setIsFollowing(newFollowState); // Optimistic UI

    try {
      const method = newFollowState ? 'POST' : 'DELETE';
      const response = await fetch(
        `http://localhost:3000/users/follow/${profileUserId}`,
        {
          method,
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error('Follow/unfollow failed:', error);
      setIsFollowing(!newFollowState); // Revert optimistic update
    } finally {
      setIsLoading(false);
    }
  };

  if (user?._id === profileUserId) return null;

  if (isInitializing) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-500"
      >
        <ImSpinner8 className="animate-spin" /> Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleFollowAction}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        isFollowing
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      } transition-colors disabled:opacity-50`}
    >
      {isLoading ? (
        <ImSpinner8 className="animate-spin" />
      ) : isFollowing ? (
        <>
          <FaUserMinus /> Unfollow
        </>
      ) : (
        <>
          <FaUserPlus /> Follow
        </>
      )}
    </button>
  );
}

export default ProfileFollowButton;
