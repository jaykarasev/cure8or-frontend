import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const playlistsApi = {
  async getAllPlaylists(token) {
    const res = await axios.get(`${BASE_URL}/playlists`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async createPlaylist(data, token) {
    try {
      const res = await axios.post(`${BASE_URL}/playlists`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("Error creating playlist:", err);
      throw err;
    }
  },

  async unlockPlaylist(playlistId, password, token) {
    try {
      console.log(
        `🔓 Sending unlock request for Playlist ID: ${playlistId} with password: ${password}`
      );
      const res = await axios.post(
        `${BASE_URL}/playlists/${playlistId}/access`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Playlist unlocked:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error unlocking playlist:", err);
      throw err;
    }
  },

  async getPlaylistById(id, token) {
    try {
      console.log(`🔍 Fetching playlist ${id} with token:`, token);
      const res = await axios.get(`${BASE_URL}/playlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Playlist fetched:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching playlist:", err);
      throw err;
    }
  },

  async updatePlaylist(id, data, token) {
    try {
      const res = await axios.patch(`${BASE_URL}/playlists/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("Error updating playlist:", err);
      throw err;
    }
  },

  async deletePlaylist(id, token) {
    try {
      const res = await axios.delete(`${BASE_URL}/playlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("Error deleting playlist:", err);
      throw err;
    }
  },
};

export default playlistsApi;
