import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithAuthAndRouter } from "../testUtils";
import PlaylistDetail from "../pages/PlaylistDetail";
import playlistsApi from "../api/playlistsApi";
import songsApi from "../api/songsApi";

// Mock the API modules for playlists and songs
jest.mock("../api/playlistsApi");
jest.mock("../api/songsApi");

// Define a sample playlist object to return in the mock response
const mockPlaylist = {
  id: "playlist123",
  name: "Chill Vibes",
  ownerId: "user1",
  isPrivate: false,
  songs: [],
};

describe("PlaylistDetail", () => {
  // Before each test, mock the API responses for playlist detail and song search
  beforeEach(() => {
    playlistsApi.getPlaylistById = jest
      .fn()
      .mockResolvedValue({ playlist: mockPlaylist });

    songsApi.searchSongs = jest.fn().mockResolvedValue([]);
  });

  // This test verifies that the PlaylistDetail page renders correctly and shows the playlist title
  test("renders playlist detail", async () => {
    renderWithAuthAndRouter(<PlaylistDetail />, {
      route: "/playlists/playlist123",
      path: "/playlists/:id",
    });

    // Wait for the loading message to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading playlist...")).not.toBeInTheDocument();
    });

    // Confirm the playlist title is rendered on the page
    expect(await screen.findByText("Chill Vibes")).toBeInTheDocument();
  });
});
