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
      const payload = {
        ...formData,
        imageUrl:
          formData.imageUrl.trim() === "" ? null : formData.imageUrl.trim(),
        password: formData.isPrivate ? formData.password : null,
      };

      await playlistsApi.createPlaylist(payload, token);
      navigate("/playlists");
    } catch (err) {
      console.error("Error creating playlist:", err);

      if (err.response && err.response.data?.error?.message) {
        const messages = err.response.data.error.message;

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
                    "is not of a type(s) boolean",
                    "must be true or false"
                  )
                  .replace(
                    'does not conform to the "uri" format',
                    "must be a valid image URL"
                  )
              )
              .join(". ")
          : messages;

        setError(errorText);
      } else {
        setError("Failed to create playlist. Please check your input.");
      }
    }
  }

  return (
    <div className="create-playlist-form">
      {error && <div className="error">{error}</div>}
      <h2>Create a New Playlist</h2>
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
