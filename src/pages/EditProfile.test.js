import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithAuthAndRouter } from "../testUtils";
import EditProfile from "./EditProfile";
import usersApi from "../api/usersApi";

// Mock API and Navigation
jest.mock("../api/usersApi");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("EditProfile", () => {
  const mockUser = {
    id: 1,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    imageUrl: "http://example.com/image.png",
  };

  const mockAuth = {
    user: mockUser,
    token: "mock-token",
    fetchUserProfile: jest.fn(),
  };

  // This test ensures the form loads correctly with the user's existing profile values
  it("renders the profile form with initial values", () => {
    renderWithAuthAndRouter(<EditProfile />, {
      route: "/profile/edit",
      path: "/profile/edit",
      authValue: mockAuth,
    });

    expect(screen.getByPlaceholderText("First Name")).toHaveValue("Jane");
    expect(screen.getByPlaceholderText("Last Name")).toHaveValue("Doe");
    expect(screen.getByPlaceholderText("Email Address")).toHaveValue(
      "jane@example.com"
    );
    expect(screen.getByPlaceholderText("Profile Image URL")).toHaveValue(
      "http://example.com/image.png"
    );
    expect(screen.getByPlaceholderText("Confirm Password")).toHaveValue("");
  });

  // This test confirms the profile update is submitted with new values and redirects after a successful update
  it("submits updated profile and redirects", async () => {
    usersApi.updateUser.mockResolvedValue({});

    renderWithAuthAndRouter(<EditProfile />, {
      route: "/profile/edit",
      path: "/profile/edit",
      authValue: mockAuth,
    });

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Updated", name: "firstName" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123", name: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update profile/i }));

    await waitFor(() => {
      expect(usersApi.updateUser).toHaveBeenCalledWith(
        1,
        expect.any(Object),
        "mock-token"
      );
      expect(mockAuth.fetchUserProfile).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  // This test checks that an error message appears if the API call fails
  it("shows error message if update fails", async () => {
    usersApi.updateUser.mockRejectedValue(new Error("Update failed"));

    renderWithAuthAndRouter(<EditProfile />, {
      route: "/profile/edit",
      path: "/profile/edit",
      authValue: mockAuth,
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "wrongpassword", name: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update profile/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to update profile. Check your password.")
      ).toBeInTheDocument();
    });
  });
});
