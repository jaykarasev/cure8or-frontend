import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithAuthAndRouter } from "../testUtils";
import Profile from "../pages/Profile";
import usersApi from "../api/usersApi";

// Mock the users API module
jest.mock("../api/usersApi");

// Define a mock authenticated user
const mockUser = {
  id: "user1",
  username: "testuser",
  firstName: "Test",
  lastName: "User",
  imageUrl: "",
};

// Auth context value passed into the test wrapper
const mockAuth = {
  user: mockUser,
  token: "test-token",
};

// Mock API response containing owned and joined playlists
const mockResponse = {
  playlists: [
    {
      id: "p1",
      name: "My Playlist",
      description: "Vibe tracks",
      imageUrl: "",
      ownerId: "user1",
    },
  ],
  accessPlaylists: [
    {
      id: "p2",
      name: "Joined Playlist",
      description: "Chill tunes",
      imageUrl: "",
      ownerId: "user2",
      ownerUsername: "anotherUser",
      isPrivate: true,
    },
  ],
};

describe("Profile", () => {
  // Set up mocked API response before each test
  beforeEach(() => {
    usersApi.getUserById = jest.fn().mockResolvedValue(mockResponse);
  });

  // Helper function to render the Profile page with routing and auth
  function renderProfile() {
    return renderWithAuthAndRouter(<Profile />, {
      route: "/profile",
      path: "/profile",
      authValue: mockAuth,
    });
  }

  // This test verifies that:
  // - the loading message appears first
  // - user info and both owned/joined playlists render after loading
  test("renders user profile and playlists", async () => {
    renderProfile();

    // Confirm loading message appears first
    expect(screen.getByText("Loading profile...")).toBeInTheDocument();

    // Wait for loading to complete and profile username to appear
    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    // Ensure both owned and joined playlists are displayed
    expect(screen.getByText("My Playlist")).toBeInTheDocument();
    expect(screen.getByText("Joined Playlist")).toBeInTheDocument();
  });
});
