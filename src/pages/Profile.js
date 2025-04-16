import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import usersApi from "../api/usersApi";
import playlistsApi from "../api/playlistsApi";
import "../styles/Profile.css";

function Profile() {
  const { user, token } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [accessPlaylists, setAccessPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await usersApi.getUserById(user.id, token);
        setPlaylists(res.playlists || []);
        setAccessPlaylists(res.accessPlaylists || []);
      } catch (err) {
        console.error("Error fetching user playlists:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user && token) fetchData();
  }, [user, token]);

  useEffect(() => {
    function handleClickOutside(e) {
      // Close the menu if click target is NOT inside a dropdown
      if (
        !e.target.closest(".profile-menu-dropdown") &&
        !e.target.closest(".profile-menu-button")
      ) {
        setMenuOpenId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDeletePlaylist(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this playlist?"
    );
    if (!confirmed) return;

    try {
      await playlistsApi.deletePlaylist(id, token);
      setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      alert("Error deleting playlist.");
    }
  }

  if (loading) return <p>Loading profile...</p>;

  const renderPlaylistRow = (pl, isOwnerView = false) => {
    const isOwner = user.id === pl.ownerId;

    return (
      <div
        className="playlist-row"
        key={pl.id}
        onClick={() =>
          navigate(`/playlists/${pl.id}`, {
            state: {
              playlistName: pl.name,
              playlistDescription: pl.description,
            },
          })
        }
      >
        <img
          src={pl.imageUrl || "https://via.placeholder.com/150"}
          alt={pl.name}
          className="playlist-row-image"
        />
        <div className="playlist-row-meta">
          <h3 className="playlist-row-name">{pl.name}</h3>

          {isOwnerView ? (
            <>
              <p className="playlist-row-description">
                {pl.description || "No description provided."}
              </p>
            </>
          ) : (
            <>
              {pl.ownerUsername && (
                <p className="playlist-row-owner">by {pl.ownerUsername}</p>
              )}
              {pl.isPrivate && (
                <p className="playlist-row-private">Private Playlist</p>
              )}
              <p className="playlist-row-description">
                {pl.description || "No description provided."}
              </p>
            </>
          )}
        </div>

        {isOwner && (
          <div
            className="profile-menu-cell"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="profile-menu-button"
              onClick={() => setMenuOpenId(menuOpenId === pl.id ? null : pl.id)}
            >
              ⋮
            </button>

            {menuOpenId === pl.id && (
              <div className="profile-menu-dropdown">
                <button
                  onClick={() => {
                    navigate(`/playlists/${pl.id}/edit`);
                    setMenuOpenId(null);
                  }}
                >
                  Edit Playlist
                </button>
                <button
                  onClick={() => {
                    handleDeletePlaylist(pl.id);
                    setMenuOpenId(null);
                  }}
                >
                  Delete Playlist
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="playlists-page">
      <div
        className="profile-header"
        style={{ marginBottom: "2rem", textAlign: "center" }}
      >
        <img
          src={user.imageUrl || "https://via.placeholder.com/100"}
          alt={user.username}
          className="profile-image"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <h1>{user.username}</h1>
        <p>
          {user.firstName} {user.lastName}
        </p>
        <Link to="/profile/edit">
          <button className="edit-profile-btn">Edit Profile</button>
        </Link>
      </div>

      <h2>My Playlists</h2>
      {playlists.length === 0 ? (
        <p>You haven't created any playlists yet.</p>
      ) : (
        <div className="playlist-list">
          {playlists.map((pl) => renderPlaylistRow(pl, true))}
        </div>
      )}

      <h2 style={{ marginTop: "2rem" }}>Playlists I’ve Joined</h2>
      {accessPlaylists.length === 0 ? (
        <p>You haven’t joined any playlists yet.</p>
      ) : (
        <div className="playlist-list">
          {accessPlaylists.map((pl) => renderPlaylistRow(pl, false))}
        </div>
      )}
    </div>
  );
}

export default Profile;
