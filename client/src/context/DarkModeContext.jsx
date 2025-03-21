import { createContext, useState, useEffect, useContext } from "react";

// Create Context
const DarkModeContext = createContext();

// Provide Context to the App
export const DarkModeProvider = ({ children }) => {
  // Get the theme from localStorage, default to "dark" if not found
  const storedTheme = localStorage.getItem("theme");
  const [darkMode, setDarkMode] = useState(storedTheme === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom Hook to Use Dark Mode
export const useDarkMode = () => useContext(DarkModeContext);