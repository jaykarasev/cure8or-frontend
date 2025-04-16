import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute() {
  const { token } = useAuth();
  const storedToken = localStorage.getItem("token");

  return storedToken || token ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
