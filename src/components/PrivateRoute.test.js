import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { AuthContext } from "../context/AuthContext";

// Dummy component for protected route
const TestComponent = () => <div>Protected Content</div>;

// Dummy login page to simulate redirection
const LoginPage = () => <div>Login Page</div>;

// Utility function to render PrivateRoute with a given token value
function renderWithAuth(tokenValue = null) {
  render(
    <AuthContext.Provider value={{ token: tokenValue }}>
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/private" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

// This test verifies that if the user is not authenticated (token is null),
// the PrivateRoute component redirects them to the login page.
it("redirects to login if not authenticated", () => {
  renderWithAuth(null);
  expect(screen.getByText("Login Page")).toBeInTheDocument();
});

// This test verifies that if the user is authenticated (token is present),
// the PrivateRoute component renders the protected component correctly.
it("renders child route if authenticated", () => {
  renderWithAuth("mock-token");
  expect(screen.getByText("Protected Content")).toBeInTheDocument();
});
