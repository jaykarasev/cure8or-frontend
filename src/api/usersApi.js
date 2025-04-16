import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const usersApi = {
  /** Fetch user profile by ID */
  async getUser(id, token) {
    const res = await axios.get(`${BASE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  /** Update user profile (requires password confirmation) */
  async updateUser(id, userData, token) {
    const res = await axios.patch(`${BASE_URL}/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  /** Delete user account (requires authentication) */
  async deleteUser(id, token) {
    const res = await axios.delete(`${BASE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  /** Get a single user's profile by ID */
  async getUserById(id, token) {
    const res = await axios.get(`${BASE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user;
  },
};

export default usersApi;
