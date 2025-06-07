import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  login as apiLogin,
  signup as apiSignup,
  fetchCurrentUser,
} from "../api/auth";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await fetchCurrentUser();
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        setError(err.message);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const { user, token } = await apiLogin(credentials);
      localStorage.setItem("token", token);
      setCurrentUser(user);

      return { user, token };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      const { user, token } = await apiSignup(userData);
      localStorage.setItem("token", token);
      setCurrentUser(user);

      return { user, token };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/");
  };

  if (!isInitialized) {
    return null;
  }

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
    isTailor: currentUser?.role === "tailor",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
