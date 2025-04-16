import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import playlistsApi from "../api/playlistsApi";
import "../styles/FormStyles.css";

function CreatePlaylist() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isPrivate: false,
    password: "",
  });

  const [error, setError] = useState(null);

  function handleChange(evt) {
    const { name, value, type, checked } = evt.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((data) => ({ ...data, [name]: val }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await playlistsApi.createPlaylist(formData, token);
      navigate("/playlists");
    } catch (err) {
      console.error("Error creating playlist:", err);
      setError("Failed to create playlist. Try again.");
    }
  }

  return (
    <div className="create-playlist-form">
      <h2>Create a New Playlist</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Playlist Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          type="textarea"
          name="description"
          placeholder="Playlist Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="Cover Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <label>
          <input
            type="checkbox"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleChange}
          />
          Private Playlist
        </label>
        {formData.isPrivate && (
          <input
            type="password"
            name="password"
            placeholder="Playlist Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        )}
        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
}

export default CreatePlaylist;
