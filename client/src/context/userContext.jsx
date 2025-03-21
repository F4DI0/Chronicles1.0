// src/context/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Fetching user data...");
        const response = await fetch("http://localhost:3000/users/myprofile", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("User data fetched:", data.myinfo);
          setUser(data.myinfo);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);