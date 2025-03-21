import { HiHome } from "react-icons/hi";
import { GoBell } from "react-icons/go";
import { MdAccountCircle } from "react-icons/md";
import { BiHelpCircle } from "react-icons/bi";
import { FaAngleDown, FaMoon, FaPowerOff, FaSun } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { AiOutlineHeart, AiOutlineSearch } from "react-icons/ai";
import { GiQuillInk } from "react-icons/gi";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { TbNotebook } from "react-icons/tb";

function TopHeader() {
  const [showMenu, setShowMenu] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const { darkMode, setDarkMode } = useDarkMode();

  const userData = {
    id: "12345", // Mock user ID
    url: "/user.png", // Mock profile image URL
    name: "User Name", // Mock user name
    email: "user@example.com", // Mock user email
  };

  useEffect(() => {
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
      setSearchQuery(""); // Clear search when clicking outside
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    fetch("http://localhost:3000/account/logout", {
      method: "GET",
      headers: {
          "contentType": "application/json"
      },
      credentials: "include"
  }).then(response =>{
      if (response.status == 200) {
        navigate("/login");
  }});
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  return (
    <div
      className={`${
        scroll
          ? "lg:container lg:mx-auto w-full flex items-center justify-around py-5 sticky top-0 z-50 bg-inherit rounded-lg"
          : "lg:container lg:mx-auto w-full flex items-center justify-around py-5 sticky top-0 z-50"
      } ${darkMode ? "bg-gray-900 text-white" : "bg-warmBeige text-warmBrown border-b-2 border-warmBrown"}`}
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
      <form
        onSubmit={handleSearch}
        className={`w-1/2 lg:w-1/3 rounded-full flex items-center px-4 py-2 focus-within:ring-2 ${
          darkMode
            ? "bg-gray-800 focus-within:ring-gray-500 text-white"
            : "bg-warmBeige focus-within:ring-warmBrown text-warmText border border-warmBrown"
        }`}
        ref={searchRef}
      >
        <AiOutlineSearch className={`text-lg ${darkMode ? "text-gray-400" : "text-warmBrown"}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent px-2 outline-none placeholder-gray-400 text-sm"
          placeholder="Search for posts, users, or books..."
        />
      </form>

      {/* Navigation Icons */}
      <span className="w-auto lg:w-2/6 flex items-center justify-center">
        <HiHome
          className={`cursor-pointer text-lg mx-3 lg:mx-7 ${darkMode ? "text-white" : "text-warmBrown"}`}
          onClick={() => navigate("/home")}
        />
        <GoBell className={`cursor-pointer text-lg mx-3 lg:mx-7 ${darkMode ? "text-white" : "text-warmBrown"}`} />
        <AiOutlineHeart
          className={`cursor-pointer text-lg mx-3 lg:mx-7 ${darkMode ? "text-white" : "text-warmBrown"}`}
          onClick={() => navigate("/liked-posts")}
        />
        <TbNotebook
          className={`cursor-pointer text-lg mx-3 lg:mx-7 ${darkMode ? "text-white" : "text-warmBrown"}`}
          onClick={() => navigate("/writers-insight")}
        />
        <GiQuillInk
          className="cursor-pointer text-lg mx-3 text-warmBrown dark:text-white"
          onClick={() => navigate("/text-editor")} // Navigate to editor page
        />
      </span>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-md transition ${
          darkMode
            ? "bg-gray-800 text-white border border-gray-600"
            : "bg-warmBrown text-warmBeige border border-warmBrown"
        }`}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* User Menu */}
      <span className="w-auto md:w-2/6 flex items-center justify-start md:justify-end cursor-pointer p-1 relative z-50">
        <span
          className="w-16 md:w-40 h-10 shadow-md bg-black/70 flex items-center justify-center rounded-md"
          onClick={() => setShowMenu(!showMenu)}
          ref={menuRef}
        >
          <img
            src={userData.url || "/user.png"}
            alt="userPic"
            className="w-9 h-5/6 object-cover rounded-lg"
          />
          <h2 className={`text-xs mx-2 font-semibold hidden md:flex ${darkMode ? "text-white" : "text-warmBrown"}`}>
            {userData.name || userData.email}
          </h2>
          <FaAngleDown className={`mx-1 ${darkMode ? "text-white" : "text-warmBrown"}`} />
        </span>

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            className={`absolute top-full mt-2 right-0 md:right-5 w-50 md:w-55  rounded-md shadow-lg p-2 flex flex-col border ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 shadow-gray-700"
                : "bg-warmBeige text-warmText border-warmBrown shadow-lg shadow-warmBrown"
            }`}
          >
            {/* Profile */}
            <button
              className={`flex items-center px-4 py-2 text-sm font-semibold transition duration-300 rounded-md ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-warmBrown hover:text-warmBeige"
              }`}
              onClick={() => {
                navigate(`/userProfile/${userData.id}`);
                setShowMenu(false);
              }}
            >
              <MdAccountCircle fontSize={18} className="mr-2" />
              Account
            </button>

            {/* Help */}
            <button
              className={`flex items-center px-4 py-2 text-sm font-semibold transition duration-300 rounded-md ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-warmBrown hover:text-warmBeige"
              }`}
              onClick={() => setShowMenu(false)}
            >
              <BiHelpCircle fontSize={18} className="mr-2" />
              Help
            </button>

            {/* Settings */}
            <button
              className={`flex items-center px-4 py-2 text-sm font-semibold transition duration-300 rounded-md ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-warmBrown hover:text-warmBeige"
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
              className={`flex items-center px-4 py-2 text-sm font-semibold transition duration-300 rounded-md ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-warmBrown hover:text-warmBeige"
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
              className={`flex items-center px-4 py-2 text-sm font-semibold transition duration-300 rounded-md ${
                darkMode ? "hover:bg-red-700 text-white" : "hover:bg-red-500 hover:text-white"
              }`}
              onClick={handleLogout}
            >
              <FaPowerOff fontSize={18} className="mr-2" />
              Log Out
            </button>
          </div>
        )}
      </span>
    </div>
  );
}

export default TopHeader;
