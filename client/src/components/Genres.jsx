import { MdClose } from "react-icons/md";
import { useDarkMode } from "../context/DarkModeContext"; // ✅ Import Dark Mode Context

function SkillCom() {
  const { darkMode } = useDarkMode(); // ✅ Use Dark Mode State
  const skill = ["Horror", "Romance", "Fiction"];

  return (
    <div
      className={`w-3/4 max-w-lg my-6 shadow-lg rounded-3xl p-6 flex flex-col items-center transition-all duration-300 ${
        darkMode
          ? "bg-black/20 text-white" // ✅ Dark Mode (Original Styling)
          : "bg-warmBeige text-warmText border border-warmBrown" // ✅ Light Mode (Beige & Brown)
      }`}
    >
      {/* Header */}
      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-gray-100" : "text-warmBrown"}`}>
        Genres
      </h2>

      {/* Input Field */}
      <input
        type="text"
        className={`w-20 sm:w-3/4 h-12 outline-none border text-sm px-4 rounded-md mb-4 transition-all duration-300 ${
          darkMode
            ? "bg-gray-800 border-gray-600 placeholder-gray-400 text-gray-300"
            : "bg-warmBeige border-warmBrown text-warmText placeholder-warmText"
        }`}
        placeholder="Add a genre..."
      />

      {/* Genre Tags */}
      <div className="w-full flex flex-wrap gap-4 p-2 justify-start">
        {skill.map((item, index) => (
          <div
            key={index}
            className={`flex items-center px-5 py-3 rounded-lg text-sm font-semibold shadow-md transition-all duration-300 ${
              darkMode
                ? "bg-[#05141D] text-gray-300"
                : "bg-warmBrown text-warmBeige"
            }`}
          >
            <span className="capitalize">{item}</span>
            <MdClose
              className={`ml-3 cursor-pointer transition-all ${
                darkMode ? "text-gray-400 hover:text-red-500" : "text-warmBeige hover:text-red-600"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillCom;
