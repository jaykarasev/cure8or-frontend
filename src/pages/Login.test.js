import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { renderWithAuthAndRouter } from "../testUtils";

// Mock login function and navigation
const mockLogin = jest.fn();
const mockNavigate = jest.fn();

// Mock useNavigate from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  // Helper function to render the Login component with mocked auth context and router
  function renderLogin() {
    return renderWithAuthAndRouter(<Login />, {
      route: "/login",
      path: "/login",
      authValue: { login: mockLogin },
    });
  }

  // This test checks that the login form renders properly and calls the login function with the correct arguments
  it("renders login form and submits", async () => {
    renderLogin();

    // Simulate user input for username/email
    fireEvent.change(screen.getByPlaceholderText("Username or Email"), {
      target: { value: "testuser" },
    });

    // Simulate user input for password
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Assert that the login function was called with correct credentials and navigation function
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "testuser",
        "password123",
        mockNavigate
      );
    });
  });
});
