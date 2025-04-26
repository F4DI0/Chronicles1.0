import { useEffect, useState } from "react";
import { useDarkMode } from "../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import ProfileFollowButton from "../components/ProfileFollowButton";


export default function FollowListModal({
    type,
    userId,
    onClose,
    followersCount,
    followingCount,
}) {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [profilePics, setProfilePics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const endpoint = type === "followers"
                    ? `http://localhost:3000/users/${userId}/followers`
                    : `http://localhost:3000/users/${userId}/following`;

                // First fetch the basic user list
                const response = await fetch(endpoint, {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setUsers(data.data || []);

                // Then fetch profile pictures for each user
                // Profile pics already included from backend now
                const pics = {};
                (data.data || []).forEach(user => {
                    if (user.preferences?.profilepic) {
                        pics[user._id] = `http://localhost:3000/${user.preferences.profilepic}`;
                    }
                }); 
                setProfilePics(pics);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [type, userId]);

    const handleUserClick = (userId) => {
        onClose(); // Close the modal first
        navigate(`/user/${userId}`); // Then navigate to the user's profile
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className={`w-full max-w-md max-h-[70vh] rounded-lg overflow-hidden flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
                {/* Modal Header */}
                <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg capitalize">{type}</h3>
                        <button
                            onClick={onClose}
                            className={`p-1 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <p className={`p-4 text-center ${darkMode ? "text-red-400" : "text-red-600"}`}>
                            {error}
                        </p>
                    ) : users.length === 0 ? (
                        <p className={`p-4 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            No {type} found
                        </p>
                    ) : (
                        <ul>
                            {users.map((user) => (
                                <li
                                    key={user._id}
                                    className={`p-4 border-b flex justify-between items-center ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"
                                        } cursor-pointer`}
                                >
                                    <div
                                        className="flex items-center gap-3"
                                        onClick={() => handleUserClick(user._id)}
                                    >
                                        <div className="relative">
                                            <img
                                                src={profilePics[user._id] || "/user.png"}
                                                alt={user.username}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/user.png";
                                                }}
                                            />
                                            {user.isWriter && (
                                                <div
                                                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${darkMode ? "border-gray-800 bg-blue-200" : "border-white bg-blue-500"
                                                        }`}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{user.username}</p>
                                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                {user.firstname} {user.lastname}
                                            </p>
                                        </div>
                                    </div>


                                    <div className="ml-4">
                                        <ProfileFollowButton profileUserId={user._id} size="small" />
                                    </div>

                                </li>
                            ))}

                        </ul>
                    )}
                </div>

                {/* Modal Footer */}
                <div className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <p className="text-sm text-center">
                        {type === "followers"
                            ? `${followersCount} ${followersCount === 1 ? 'follower' : 'followers'}`
                            : `${followingCount} following`}
                    </p>
                </div>
            </div>
        </div>
    );
}