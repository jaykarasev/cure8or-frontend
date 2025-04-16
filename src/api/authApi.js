import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const authApi = {
  async login(identifier, password) {
    try {
      const res = await axios.post(`${BASE_URL}/auth/token`, {
        identifier,
        password,
      });
      console.log("API Login Response:", res.data); // ✅ Debug API response

      if (!res.data.user) {
        console.error("Login failed: User object is missing in API response.");
        return null;
      }
      return res.data;
    } catch (err) {
      console.error("Error logging in:", err);
      throw err;
    }
  },

  async signup(userData) {
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, userData);
      console.log("API Signup Response:", res.data); // ✅ Debug API response

      if (!res.data.user) {
        console.error("Signup failed: User object is missing in API response.");
        return null;
      }

      return res.data; // ✅ Ensure both token & user are returned
    } catch (err) {
      console.error("Error signing up:", err);
      throw err;
    }
  },

  async getProfile(token) {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?.id) {
        console.error(
          "No user ID found in localStorage. Skipping profile fetch."
        );
        return null;
      }

      const res = await axios.get(`${BASE_URL}/users/${storedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  },
};

export default authApi;
