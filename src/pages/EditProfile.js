import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import usersApi from "../api/usersApi";
import { useNavigate } from "react-router-dom";
import "../styles/FormStyles.css";

function EditProfile() {
  const { user, token, fetchUserProfile } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    imageUrl: user?.imageUrl || "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // ⏳ Wait until fetchUserProfile finishes and user is fully updated
    if (shouldRedirect && user?.id) {
      navigate("/profile");
    }
  }, [shouldRedirect, user, navigate]);

  if (!user || !token) {
    return <p>User not authenticated.</p>;
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((data) => ({ ...data, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const payload = {
        ...formData,
        imageUrl:
          formData.imageUrl.trim() === "" ? null : formData.imageUrl.trim(),
      };

      await usersApi.updateUser(userId, payload, token);

      await fetchUserProfile();
      setSuccess(true);
      setError(null);
      setShouldRedirect(true);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Check your password.");
      setSuccess(false);
    }
  }

  return (
    <div className="edit-profile-page">
      <h2>Edit Profile</h2>
      {error && <div className="error">{error}</div>}
      {success && (
        <p style={{ color: "green" }}>Profile updated successfully!</p>
      )}
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="Profile Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Confirm Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default EditProfile;
