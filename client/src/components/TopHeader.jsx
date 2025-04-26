import { HiHome } from "react-icons/hi";
import { GoBell } from "react-icons/go";
import { MdAccountCircle } from "react-icons/md";
import { BiHelpCircle } from "react-icons/bi";
import { FaAngleDown, FaMoon, FaPowerOff, FaSun } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { AiOutlineClose, AiOutlineHeart, AiOutlineSearch } from "react-icons/ai";
import { GiQuillInk } from "react-icons/gi";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { TbNotebook } from "react-icons/tb";
import { ImLibrary } from "react-icons/im";


function TopHeader() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchType, setSearchType] = useState("posts");
  const [isSearching, setIsSearching] = useState(false);
  const [profilePics, setProfilePics] = useState({});

  const navigate = useNavigate();
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const { darkMode, setDarkMode } = useDarkMode();

  // Fetch user data, followers, and following counts
  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/myprofile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data.myinfo);
      setFollowersCount(data.followers);
      setFollowingCount(data.following);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch profile pictures for search results
  const fetchProfilePics = async () => {
    if (searchType !== "people" || !searchResults) return;

    const pics = { ...profilePics };
    for (const result of searchResults) {
      if (!pics[result._id]) {
        try {
          const res = await fetch(`http://localhost:3000/users/${result._id}`, {
            credentials: "include",
          });

          if (res.ok) {
            const data = await res.json();
            if (data.preferences?.profilepic) {
              pics[result._id] = `http://localhost:3000/${data.preferences.profilepic}`;
            } else {
              pics[result._id] = "/user.png";
            }
          }
        } catch (error) {
          console.error("Error fetching profile pic for", result._id, error);
          pics[result._id] = "/user.png";
        }
      }
    }

    setProfilePics(pics);
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:3000/notifications/getall", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      console.log(data);
      setNotifications(data.data);
      setUnseenCount(data.unseenNotificationsCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark notifications as read
  const markNotificationsAsRead = async () => {
    try {
      const response = await fetch("http://localhost:3000/notifications/markread", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }
      setUnseenCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Perform search
  const performSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:3000/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data.result);
      setShowSearchResults(true);
      
      // Fetch profile pictures after search results are set
      if (searchType === "people") {
        await fetchProfilePics();
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        performSearch();
      } else {
        setSearchResults(null);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchType]);

  useEffect(() => {
    fetchUserData();
    fetchNotifications();
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY > 45);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchResults(false);
    }
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
      setShowSearchResults(false);
    }
  };

  const handleSearchItemClick = (item) => {
    if (searchType === "people") {
      // Navigate to the user's profile
      navigate(`/user/${item._id}`);
    } else {
      // Navigate to the post
      navigate(`/post/${item._id}`);
    }
    // Close search results after clicking
    setShowSearchResults(false);
    // Clear search query
    setSearchQuery("");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/account/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  return (
    <div
      className={`${scroll
          ? "lg:container lg:mx-auto w-full flex items-center justify-around py-5 sticky top-0 z-50 rounded-lg shadow-md"
          : "lg:container lg:mx-auto w-full flex items-center justify-around py-5 sticky top-0 z-50"
        } ${darkMode
          ? "bg-gray-900 text-white border-b border-gray-700"
          : "bg-warmBeige text-warmBrown border-b-2 border-warmBrown"
        }`}
    >
      {/* Logo */}
      <span className="w-auto lg:w-2/6 flex items-center justify-center relative">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-12 h-12 cursor-pointer"
          onClick={() => navigate("/home")}
        />
      </span>

      {/* Search Bar */}
      <div className="relative w-full md:w-2/3 lg:w-1/2 xl:w-1/3" ref={searchRef}>
        <form
          onSubmit={handleSearchSubmit}
          className={`rounded-full flex items-center px-4 py-2 transition-all duration-200 shadow-sm ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 focus-within:bg-gray-600 focus-within:ring-2 focus-within:ring-blue-400 text-white"
              : "bg-white hover:bg-warmBeige focus-within:bg-warmBeige focus-within:ring-2 focus-within:ring-warmBrown text-warmDark border border-warmBrown/30 hover:border-warmBrown/50"
          }`}
        >
          <AiOutlineSearch className={`text-lg mr-2 flex-shrink-0 ${
            darkMode ? "text-gray-400" : "text-warmBrown"
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() !== "" && setShowSearchResults(true)}
            className="w-full bg-transparent px-1 outline-none placeholder-gray-400 text-sm"
            placeholder="Search for posts, users, or books..."
          />
          {isSearching ? (
            <div className="ml-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-transparent border-t-current border-l-current"></div>
            </div>
          ) : (
            searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <AiOutlineClose className="text-sm" />
              </button>
            )
          )}
        </form>

        {/* Search Type Toggle */}
        <div className="absolute left-0 mt-2 flex bg-white dark:bg-gray-700 rounded-md shadow-sm overflow-auto border border-warmBrown/20 dark:border-gray-600">
          <button
            type="button"
            className={`text-xs px-3 py-1.5 transition-colors duration-150 ${
              searchType === "posts"
                ? darkMode
                  ? "bg-blue-500 text-white"
                  : "bg-warmBrown text-white"
                : darkMode
                ? "hover:bg-gray-600 text-gray-300"
                : "hover:bg-warmBeige text-warmBrown"
            }`}
            onClick={() => setSearchType("posts")}
          >
            Posts
          </button>
          <div className="h-full w-px bg-gray-200 dark:bg-gray-600"></div>
          <button
            type="button"
            className={`text-xs px-3 py-1.5 transition-colors duration-150 ${
              searchType === "people"
                ? darkMode
                  ? "bg-blue-500 text-white"
                  : "bg-warmBrown text-white"
                : darkMode
                ? "hover:bg-gray-600 text-gray-300"
                : "hover:bg-warmBeige text-warmBrown"
            }`}
            onClick={() => setSearchType("people")}
          >
            People
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div
            className={`absolute mt-3 w-full rounded-lg shadow-lg overflow-auto transition-all duration-200 z-50 ${
              darkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-warmBrown/20"
            }`}
          >
            {isSearching ? (
              <div className="p-4 flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-r-2 border-transparent border-t-current border-l-current"></div>
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <ul className="divide-y divide-warmBrown/10 dark:divide-gray-600">
                {searchResults.map((item) => (
                  <li
                    key={item._id}
                    className={`p-3 transition-colors duration-150 cursor-pointer ${
                      darkMode ? "hover:bg-gray-600" : "hover:bg-warmBeige/50"
                    }`}
                    onClick={() => handleSearchItemClick(item)}
                  >
                    {searchType === "people" ? (
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={profilePics[item._id] || "/user.png"}
                            alt={item.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                          />
                          {item.isWriter && (
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
                              darkMode ? "border-gray-700 bg-blue-400" : "border-white bg-blue-400"
                            }`} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{item.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {item.firstname} {item.lastname}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          by {item.author?.username || "Unknown author"}
                        </p>
                        <div className="flex items-center mt-1">
                          {item.author?.preferences?.profilepic && (
                            <img
                              src={`http://localhost:3000/${item.author.preferences.profilepic}`}
                              alt={item.author.username}
                              className="w-5 h-5 rounded-full mr-2 border border-warmBrown/20"
                            />
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery.trim() ? "No results found" : "Start typing to search"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Icons */}
      <span className="w-auto lg:w-2/6 flex items-center justify-center">
        <HiHome
          className={`cursor-pointer text-lg mx-3 lg:mx-7 ${darkMode ? "text-white" : "text-warmBrown"}`}
          onClick={() => navigate("/home")}
        />
        {/* Notification Bell */}
        <span className="relative" ref={notificationRef}>
          <GoBell
            className={`cursor-pointer text-lg mx-3 lg:mx-7 ${darkMode ? "text-white" : "text-warmBrown"}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) {
                markNotificationsAsRead();
              }
            }}
          />
          {unseenCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {unseenCount}
            </span>
          )}
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className={`absolute top-full mt-2 right-0 w-64 max-h-80 overflow-y-auto rounded-md shadow-lg p-2 flex flex-col border ${darkMode
                  ? "bg-gray-800 text-white border-gray-700 shadow-gray-700"
                  : "bg-warmBeige text-warmText border-warmBrown shadow-lg shadow-warmBrown"
                }`}
            >
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-2 text-sm rounded-md ${darkMode ? "hover:bg-gray-700" : "hover:bg-warmBrown hover:text-warmBeige"
                      }`}
                  >
                    <p>
                      <strong>{notification.from_author.username}</strong>{" "}
                      {notification.notificationtype === "like"
                        ? "liked your post"
                        : notification.notificationtype === "comment"
                          ? "commented on your post"
                          : "reposted your post"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(notification.date).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center">No new notifications</p>
              )}
            </div>
          )}
        </span>
        <AiOutlineHeart
          className={`cursor-pointer text-lg mx-3 lg:mx-7 ${darkMode ? "text-white" : "text-warmBrown"}`}
          onClick={() => navigate("/liked-posts")}
        />
        <ImLibrary 
          className={`cursor-pointer text-lg mx-3 lg:mx-7 ${darkMode ? "text-white" : "text-warmBrown"}`}
          onClick={() => navigate("/bookstore")}
        />
        {userData?.isWriter && (
          <>
            <TbNotebook
              className={`cursor-pointer text-lg mx-3 lg:mx-7 ${darkMode ? "text-white" : "text-warmBrown"}`}
              onClick={() => navigate("/writers-insight")}
            />
            <GiQuillInk
              className="cursor-pointer text-lg mx-3 text-warmBrown dark:text-white"
              onClick={() => navigate("/text-editor")}
            />
          </>
        )}
      </span>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-md transition ${darkMode
            ? "bg-gray-800 text-white border border-gray-600"
            : "bg-warmBrown text-warmBeige border border-warmBrown"
          }`}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* User Menu */}
      {userData && (
        <span className="w-auto md:w-2/6 flex items-center justify-start md:justify-end cursor-pointer p-1 relative z-50">
          <span
            className="w-16 md:w-40 h-10 shadow-md bg-black/70 flex items-center justify-center rounded-md"
            onClick={() => setShowMenu(!showMenu)}
            ref={menuRef}
          >
            <h2 className={`text-xs mx-2 font-semibold hidden md:flex ${darkMode ? "text-white" : "text-warmBrown"}`}>
              {userData.username || userData.email}
            </h2>
            <FaAngleDown className={`mx-1 ${darkMode ? "text-white" : "text-warmBrown"}`} />
          </span>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              className={`absolute top-full mt-2 right-0 md:right-5 w-50 md:w-55 rounded-md shadow-lg p-2 flex flex-col border ${darkMode
                  ? "bg-gray-800 text-white border-gray-700 shadow-gray-700"
                  : "bg-warmBeige text-warmText border-warmBrown shadow-lg shadow-warmBrown"
                }`}
            >
              {/* Profile */}
              <button
                className={`flex items-center px-4 py-2 text-sm font-semibold transition duration-300 rounded-md ${darkMode ? "hover:bg-gray-700" : "hover:bg-warmBrown hover:text-warmBeige"
                  }`}
                onClick={() => {
                  navigate(`/userProfile/${userData._id}`);
                  setShowMenu(false);
                }}
              >
                <MdAccountCircle fontSize={18} className="mr-2" />
                Account
              </button>

              {/* Help */}
              <button
                className={`flex items-center px-4 py-2 text-sm font-semibold transition duration-300 rounded-md ${darkMode ? "hover:bg-gray-700" : "hover:bg-warmBrown hover:text-warmBeige"
                  }`}
                onClick={() => setShowMenu(false)}
              >
                <BiHelpCircle fontSize={18} className="mr-2" />
                Help
              </button>

              {/* Settings */}
              <button
                className={`flex items-center px-4 py-2 text-sm font-semibold transition duration-300 rounded-md ${darkMode ? "hover:bg-gray-700" : "hover:bg-warmBrown hover:text-warmBeige"
                  }`}
                onClick={() => {
                  navigate("/settings");
                  setShowMenu(false);
                }}
              >
                <FiSettings fontSize={18} className="mr-2" />
                Settings
              </button>

              {/* Become A Writer */}
              <button
                className={`flex items-center px-4 py-2 text-sm font-semibold transition duration-300 rounded-md ${darkMode ? "hover:bg-gray-700" : "hover:bg-warmBrown hover:text-warmBeige"
                  }`}
                onClick={() => {
                  navigate("/BecomeWriterForm");
                  setShowMenu(false);
                }}
              >
                <GiQuillInk fontSize={18} className="mr-2" />
                Become A Writer
              </button>

              {/* Logout */}
              <button
                className={`flex items-center px-4 py-2 text-sm font-semibold transition duration-300 rounded-md ${darkMode ? "hover:bg-red-700 text-white" : "hover:bg-red-500 hover:text-white"
                  }`}
                onClick={handleLogout}
              >
                <FaPowerOff fontSize={18} className="mr-2" />
                Log Out
              </button>
            </div>
          )}
        </span>
      )}
    </div>
  );
}

export default TopHeader;