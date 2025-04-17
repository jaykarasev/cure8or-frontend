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

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/playlists");
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
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

      if (err.response && err.response.data?.error?.message) {
        const messages = err.response.data.error.message;

        // If it's an array, join all messages into one string
        const errorText = Array.isArray(messages)
          ? messages
              .map((msg) =>
                msg
                  .replace("instance.", "")
                  .replace(
                    /does not meet minimum length of (\d+)/,
                    "must be at least $1 characters long"
                  )
                  .replace("is not of a type(s) string", "is required")
                  .replace(
                    "is not a valid email address",
                    "must be a valid email"
                  )
              )
              .join(". ")
          : messages;

        throw new Error(errorText); // Re-throw with cleaned message
      } else {
        throw new Error("Signup failed. Please check your input.");
      }
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
