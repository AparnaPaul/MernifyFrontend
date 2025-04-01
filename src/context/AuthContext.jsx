import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie"
// Ensure context is always created at the top level
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (name, token, role, email) => {
    setBtnLoading(true);
    try {
      const tokenFromCookies = Cookies.get('token'); // Get token from cookies
      console.log("Logging in:", name, "Role:", role, "Email:", email); // Debugging

      const userData = { username: name, role, email };

      // If token exists, store it in localStorage
      if (!tokenFromCookies) {
        console.warn("No token found in cookies. Ensure cookies are set properly.");
        // toast.error("No token received from server");
      }

      localStorage.setItem("loggedInUser", JSON.stringify({ user: userData }));
      setUser(userData);
      setIsAuth(true);
      toast.success("Logged in successfully");

      navigate(role === "admin" ? "/adminDashboard" : "/"); // Redirect based on role

    } catch (error) {
      toast.error("Login failed");
      console.error("Login error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  const fetchUser = () => {
    const storedUser = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");

    console.log("Fetching User:", storedUser, "Token:", token); // Debugging

    try {
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser)?.user;
        if (parsedUser && parsedUser.username) {
          setUser(parsedUser);
          setIsAuth(true);
          console.log("User set from localStorage:", parsedUser);
        } else {
          throw new Error("Invalid user data");
        }
      } else {
        throw new Error("No valid user found");
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      setUser(null);
      setIsAuth(false);
      localStorage.removeItem("loggedInUser"); 
    }

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    Cookies.remove('token'); 
    setUser(null);
    setIsAuth(false);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, loading, btnLoading, login, logout }}>
      {!loading && children} {/* Prevent rendering before authentication is checked */}
      <Toaster />
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
