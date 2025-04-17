import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import playlistsApi from "../api/playlistsApi";
import { AuthContext } from "../context/AuthContext";
import "../styles/EditPlaylist.css";
import "../styles/FormStyles.css";

function EditPlaylist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isPrivate: false,
    password: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await playlistsApi.getPlaylistById(id, token);
        const { name, description, imageUrl, isPrivate, password } =
          res.playlist;
        setFormData({
          name,
          description,
          imageUrl: imageUrl || "",
          isPrivate,
          password: password || "",
        });
      } catch (err) {
        console.error("Error loading playlist:", err);
        setError("Failed to load playlist. Try again later.");
      }
    }

    fetchPlaylist();
  }, [id, token]);

  function handleChange(evt) {
    const { name, value, type, checked } = evt.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((f) => {
      if (name === "isPrivate") {
        return {
          ...f,
          isPrivate: val,
          password: val ? f.password : "", // Clear password when switching to public
        };
      }
      return { ...f, [name]: val };
    });
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    if (formData.isPrivate && !formData.password.trim()) {
      setError("Password is required when making a playlist private.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        imageUrl:
          formData.imageUrl.trim() === "" ? null : formData.imageUrl.trim(),
        isPrivate: formData.isPrivate,
        password: formData.isPrivate ? formData.password : null,
      };

      await playlistsApi.updatePlaylist(id, payload, token);
      navigate(`/playlists/${id}`);
    } catch (err) {
      console.error("Failed to update playlist:", err);

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
        setError("Could not update playlist. Please check your input.");
      }
    }
  }

  return (
    <div className="edit-playlist-form">
      <h2>Edit Playlist</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />

        <div className="checkbox-group">
          <input
            id="isPrivate"
            type="checkbox"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleChange}
          />
          <label htmlFor="isPrivate">Private Playlist</label>
        </div>

        {formData.isPrivate && (
          <>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditPlaylist;
