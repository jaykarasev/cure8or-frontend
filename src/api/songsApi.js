import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const songsApi = {
  async searchSongs(query, token) {
    const res = await axios.get(`${BASE_URL}/songs/search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.songs; //  direct return
  },

  async addSongToPlaylist(playlistId, songId, token) {
    const res = await axios.post(
      `${BASE_URL}/playlist_songs/${playlistId}/songs/${songId}`,
      {}, // No body needed
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  async removeSongFromPlaylist(playlistId, songId, token) {
    const res = await axios.delete(
      `${BASE_URL}/playlist_songs/${playlistId}/songs/${songId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  async createSong(songData, token) {
    const res = await axios.post(`${BASE_URL}/songs`, songData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.song; // Match backend route's response shape
  },
};

export default songsApi;
