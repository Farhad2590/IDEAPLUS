import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const useAuth = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("loggedInUserId");
        if (!token || !userId) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://ideaplus.vercel.app/auth/user/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.user);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserId");
    setUserData(null);
    navigate("/signIn");
  };

  return {
    userData,
    loading,
    error,
    handleLogout,
    isAuthenticated: !!userData,
  };
};

export default useAuth;
