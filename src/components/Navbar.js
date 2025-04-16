import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/playlists" className="brand">
          CURE8OR
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/playlists">Playlists</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={() => logout(navigate)} className="logout-btn">
              Logout
            </button>{" "}
            {/* Pass navigate */}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
