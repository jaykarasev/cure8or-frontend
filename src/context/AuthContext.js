import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await authApi.getProfile(token);
      const userData = response.user || response; // handle either shape
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("Error fetching user profile:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUserProfile();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  }, [token, fetchUserProfile]);

  async function login(identifier, password, navigate) {
    try {
      const res = await authApi.login(identifier, password);
      const { token, user } = res;

      // ✅ Clear old data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // ✅ Set new user and token
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Navigate
      navigate("/playlists");
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  async function signup(userData, navigate) {
    try {
      const res = await authApi.signup(userData);
      const { token, user } = res;
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/playlists");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  }

  function logout(navigate) {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (navigate) {
      navigate("/login");
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, loading, fetchUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, AuthContext, useAuth };
