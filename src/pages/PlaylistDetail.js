import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import playlistsApi from "../api/playlistsApi";
import songsApi from "../api/songsApi";
import { AuthContext } from "../context/AuthContext";
import "../styles/PlaylistDetail.css";

function PlaylistDetail() {
  const { id } = useParams();
  const { user: currentUser, token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const initialName = location.state?.playlistName || "Loading...";

  const [playlist, setPlaylist] = useState(null);
  const [password, setPassword] = useState("");
  const [needsUnlock, setNeedsUnlock] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [songError, setSongError] = useState(null);
  const [menuOpenForSongId, setMenuOpenForSongId] = useState(null);
  const [playlistMenuOpen, setPlaylistMenuOpen] = useState(false);
  const [hoveredSongId, setHoveredSongId] = useState(null);

  useEffect(() => {
    function handleClickOutside(e) {
      const isSongMenu =
        e.target.closest(".menu-dropdown") || e.target.closest(".menu-button");
      const isPlaylistMenu =
        e.target.closest(".playlist-options-dropdown") ||
        e.target.closest(".playlist-options-button");

      if (!isSongMenu) setMenuOpenForSongId(null);
      if (!isPlaylistMenu) setPlaylistMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatDuration(ms) {
    if (!ms) return "—";
    const totalSec = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchPlaylist() {
      if (!token) return;
      try {
        const res = await playlistsApi.getPlaylistById(id, token);
        if (isMounted) {
          setPlaylist(res.playlist);
          setNeedsUnlock(false);
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 401) {
            setNeedsUnlock(true);
          } else {
            setError("Failed to load playlist");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPlaylist();

    return () => {
      isMounted = false;
    };
  }, [id, token]);

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await playlistsApi.unlockPlaylist(id, password, token);
      setPlaylist(res.playlist);
      setNeedsUnlock(false);
    } catch (err) {
      setError("Incorrect password.");
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this playlist?"
    );
    if (!confirmDelete) return;

    try {
      await playlistsApi.deletePlaylist(id, token);
      navigate("/playlists");
    } catch (err) {
      console.error("Error deleting playlist:", err);
      alert("Failed to delete playlist.");
    }
  }

  async function handleSpotifySearch(e) {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setSongError(null);

    try {
      const results = await songsApi.searchSongs(searchTerm, token);
      setSearchResults(results);
    } catch (err) {
      console.error("Spotify search failed:", err);
      setError("Failed to search Spotify.");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleAddSong(song) {
    setSongError(null);
    try {
      await songsApi.addSongToPlaylist(id, song.spotifyId, token);
      const updated = await playlistsApi.getPlaylistById(id, token);
      setPlaylist(updated.playlist);
      setSearchTerm("");
      setSearchResults([]);
    } catch (err) {
      console.error("Failed to add song:", err);
      const isDuplicate =
        err.response?.data?.error?.message?.includes("duplicate key") ||
        err.response?.data?.error?.message?.includes("already exists");

      setError(
        isDuplicate
          ? "That song is already on this playlist."
          : "Could not add song to playlist."
      );
    }
  }

  async function handleDeleteSong(songId) {
    try {
      await songsApi.removeSongFromPlaylist(id, songId, token);
      const updated = await playlistsApi.getPlaylistById(id, token);
      setPlaylist(updated.playlist);
    } catch (err) {
      console.error("Failed to delete song:", err);
      setError("Could not delete song from playlist.");
    }
  }

  function canDeleteSong(song) {
    return (
      currentUser?.id === playlist.ownerId || currentUser?.id === song.addedBy
    );
  }

  return (
    <div className="playlist-detail">
      {playlist && (
        <div className="playlist-header">
          <img
            src={playlist.imageUrl}
            alt={playlist.name}
            className="playlist-cover-img"
          />
          <div className="playlist-meta">
            <h2 className="playlist-name">{playlist.name}</h2>
            <p className="playlist-description">{playlist.description}</p>

            {playlist.ownerId === currentUser?.id && (
              <div className="playlist-options-wrapper horizontal">
                <button
                  className="playlist-options-button"
                  onClick={() => setPlaylistMenuOpen(!playlistMenuOpen)}
                >
                  ...
                </button>

                {playlistMenuOpen && (
                  <div className="playlist-options-dropdown">
                    <button
                      onClick={() => {
                        navigate(`/playlists/${id}/edit`);
                        setPlaylistMenuOpen(false);
                      }}
                    >
                      Edit Playlist
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setPlaylistMenuOpen(false);
                      }}
                    >
                      Delete Playlist
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      {songError && <div className="error">{songError}</div>}

      {loading ? (
        <p>Loading playlist...</p>
      ) : needsUnlock ? (
        <>
          <h3>🔒 This playlist is private</h3>
          <form
            onSubmit={handlePasswordSubmit}
            autoComplete="off"
            className="password-form"
          >
            <label htmlFor="playlist-password">Enter password:</label>
            <input
              type="text"
              id="playlist-password"
              name="playlist-access"
              className="masked-input"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Unlock Playlist</button>
          </form>
        </>
      ) : playlist ? (
        <>
          {playlist.songs?.length > 0 ? (
            <div className="song-table">
              <div className="song-header">
                <span>Title</span>
                <span>Artist</span>
                <span>Album</span>
                <span>Duration</span>
                <span>Added By</span>
              </div>

              {playlist.songs.map((song) => (
                <div
                  className="song-row"
                  key={`${song.id}-${song.spotifyId}`}
                  onMouseEnter={() => setHoveredSongId(song.id)}
                  onMouseLeave={() => setHoveredSongId(null)}
                >
                  <span className="song-title-cell">
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="song-cover-img"
                    />
                    <div>
                      <div className="song-title-text">{song.title}</div>
                    </div>
                  </span>

                  <span>{song.artist}</span>
                  <span>{song.album}</span>
                  <span>{formatDuration(song.duration)}</span>

                  <span className="added-by-cell">
                    {song.addedByImage ? (
                      <div className="added-by-info">
                        <img
                          src={song.addedByImage}
                          alt="User"
                          className="song-added-by-img"
                        />
                        <div className="added-by-username">
                          {song.addedByUsername || "User"}
                        </div>
                      </div>
                    ) : (
                      "—"
                    )}
                  </span>

                  <span className="menu-cell">
                    {hoveredSongId === song.id && canDeleteSong(song) && (
                      <>
                        <button
                          className="menu-button"
                          onClick={() =>
                            setMenuOpenForSongId(
                              menuOpenForSongId === song.id ? null : song.id
                            )
                          }
                        >
                          ⋮
                        </button>

                        {menuOpenForSongId === song.id && (
                          <div className="menu-dropdown">
                            <button
                              onClick={() => {
                                handleDeleteSong(song.id);
                                setMenuOpenForSongId(null);
                              }}
                            >
                              Remove Song
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>This playlist has no songs yet.</p>
          )}

          <hr />

          <form onSubmit={handleSpotifySearch} className="spotify-search-form">
            <input
              type="text"
              placeholder="Search for songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results</h3>
              <div className="search-results-list">
                {searchResults.map((song) => (
                  <div className="search-result-row" key={song.spotifyId}>
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="search-result-img"
                    />
                    <div className="search-result-info">
                      <div className="search-result-title">{song.title}</div>
                      <div className="search-result-artist">{song.artist}</div>
                    </div>
                    <button
                      className="add-song-btn"
                      onClick={() => handleAddSong(song)}
                    >
                      ➕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default PlaylistDetail;
