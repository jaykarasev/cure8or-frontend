import React from "react";
import { Link } from "react-router-dom";
import "../styles/PlaylistCard.css";

function PlaylistCard({ playlist }) {
  return (
    <div className="playlist-card">
      <h3>{playlist.name}</h3>
      <p>{playlist.description}</p>
      {playlist.isPrivate ? (
        <span className="private-badge">Private</span>
      ) : (
        <span className="public-badge">Public</span>
      )}
      <Link to={`/playlists/${playlist.id}`} className="view-btn">
        View
      </Link>
    </div>
  );
}

export default PlaylistCard;
