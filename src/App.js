import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Navbar from "./components/Navbar";
import CreatePlaylist from "./pages/CreatePlaylist";
import EditPlaylist from "./pages/EditPlaylist";

function PrivateRoute({ element }) {
  const { user, token, loading } = useContext(AuthContext);
  const storedToken = localStorage.getItem("token");
  if (loading) return null; // Prevents flickering on refresh
  return storedToken || token ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/playlists"
            element={<PrivateRoute element={<Playlists />} />}
          />
          <Route
            path="/playlists/new"
            element={<PrivateRoute element={<CreatePlaylist />} />}
          />
          <Route
            path="/playlists/:id"
            element={<PrivateRoute element={<PlaylistDetail />} />}
          />
          <Route path="/playlists/:id/edit" element={<EditPlaylist />} />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="*" element={<ProtectedHome />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function ProtectedHome() {
  const { token, user, loading } = useContext(AuthContext);
  const storedToken = localStorage.getItem("token");
  if (loading) return null;
  return storedToken || token ? (
    <Navigate to="/playlists" />
  ) : (
    <Navigate to="/login" />
  );
}

export default App;
