import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import playlistsApi from "../api/playlistsApi";
import { useAuth } from "../context/AuthContext";
import "../styles/Playlists.css";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await playlistsApi.getAllPlaylists();
        setPlaylists(res.playlists);
        setFilteredPlaylists(res.playlists);
      } catch (err) {
        console.error("❌ Error fetching playlists:", err);
        setError("Failed to load playlists.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const filtered = playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaylists(filtered);
  }, [searchTerm, playlists]);

  if (loading) return <p>Loading playlists...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="playlists-page">
      <div className="playlists-header">
        <h2>All Playlists</h2>
        <button onClick={() => navigate("/playlists/new")}>
          + Create New Playlist
        </button>
      </div>

      <input
        type="text"
        placeholder="Search playlists..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="playlist-search-input"
      />

      {filteredPlaylists.length === 0 ? (
        <p>No playlists match your search.</p>
      ) : (
        <div className="playlist-list">
          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="playlist-row"
              onClick={() =>
                navigate(`/playlists/${playlist.id}`, {
                  state: {
                    playlistName: playlist.name,
                    playlistDescription: playlist.description,
                  },
                })
              }
            >
              <img
                src={playlist.imageUrl}
                alt={playlist.name}
                className="playlist-row-image"
              />
              <div className="playlist-row-meta">
                <h3 className="playlist-row-name">{playlist.name}</h3>
                <p className="playlist-row-owner">
                  by {playlist.ownerUsername}
                </p>
                {playlist.isPrivate && (
                  <p className="playlist-row-private">Private Playlist</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Playlists;
