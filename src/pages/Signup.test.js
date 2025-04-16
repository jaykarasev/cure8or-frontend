import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithAuthAndRouter } from "../testUtils";
import Signup from "../pages/Signup";

describe("Signup", () => {
  // Mock the signup function passed through AuthContext
  const mockSignup = jest.fn();

  // Utility function to render the Signup component with mocked auth context
  function renderSignup() {
    return renderWithAuthAndRouter(<Signup />, {
      authValue: { signup: mockSignup },
    });
  }

  // This test verifies that:
  // - the signup form renders with all required fields
  // - the form submits user data correctly
  // - the mock signup function is called with the correct payload
  test("renders signup form and submits correctly", async () => {
    renderSignup();

    // Fill out the form inputs
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser", name: "username" },
    });
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Test", name: "firstName" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "User", name: "lastName" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password", name: "password" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Profile Image URL (Optional)"),
      {
        target: { value: "http://image.com/pic.jpg", name: "imageUrl" },
      }
    );

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }));

    // Confirm mockSignup was called with the correct data
    expect(mockSignup).toHaveBeenCalledWith(
      {
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password",
        imageUrl: "http://image.com/pic.jpg",
      },
      expect.any(Function)
    );
  });
});
