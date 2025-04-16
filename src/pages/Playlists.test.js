import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { renderWithAuthAndRouter } from "../testUtils";
import Playlists from "../pages/Playlists";
import playlistsApi from "../api/playlistsApi";

// Mock the playlists API module
jest.mock("../api/playlistsApi");

// Mock authenticated user context
const mockAuth = {
  user: { id: "user1", username: "testuser" },
  token: "mock-token",
};

// Define the fake playlists response
const mockPlaylists = {
  playlists: [
    {
      id: "playlist1",
      name: "Morning Jams",
      description: "Start your day right",
      imageUrl: "http://mockimage.com/image1.jpg",
      ownerUsername: "testuser",
      isPrivate: false,
    },
    {
      id: "playlist2",
      name: "Evening Chill",
      description: "Relaxing tunes",
      imageUrl: "http://mockimage.com/image2.jpg",
      ownerUsername: "anotheruser",
      isPrivate: true,
    },
  ],
};

describe("Playlists Page", () => {
  // Mock API call before each test
  beforeEach(() => {
    playlistsApi.getAllPlaylists = jest.fn().mockResolvedValue(mockPlaylists);
  });

  // Helper function to render the component with router and auth context
  function renderPlaylists() {
    return renderWithAuthAndRouter(<Playlists />, {
      route: "/playlists",
      path: "/playlists",
      authValue: mockAuth,
    });
  }

  // This test ensures that the loading message is shown initially,
  // then playlists are rendered correctly with all expected text
  test("displays loading message and renders playlists", async () => {
    renderPlaylists();

    expect(screen.getByText("Loading playlists...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText("Loading playlists...")).not.toBeInTheDocument()
    );

    expect(screen.getByText("All Playlists")).toBeInTheDocument();
    expect(screen.getByText("Morning Jams")).toBeInTheDocument();
    expect(screen.getByText("Evening Chill")).toBeInTheDocument();
    expect(screen.getByText("by testuser")).toBeInTheDocument();
    expect(screen.getByText("Private Playlist")).toBeInTheDocument();
  });

  // This test verifies that the search input filters playlists
  // and only displays matches based on the search term
  test("filters playlists based on search input", async () => {
    renderPlaylists();

    await waitFor(() =>
      expect(screen.getByText("Morning Jams")).toBeInTheDocument()
    );

    const input = screen.getByPlaceholderText("Search playlists...");
    fireEvent.change(input, { target: { value: "morning" } });

    expect(screen.getByText("Morning Jams")).toBeInTheDocument();
    expect(screen.queryByText("Evening Chill")).not.toBeInTheDocument();
  });
});
