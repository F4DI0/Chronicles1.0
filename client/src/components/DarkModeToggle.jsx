import { useDarkMode } from "../context/DarkModeContext";
import { FaMoon, FaSun } from "react-icons/fa";

function DarkModeToggle() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode((prevMode) => !prevMode)}
      className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white"
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default DarkModeToggle;
