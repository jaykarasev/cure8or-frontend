import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { renderWithAuthAndRouter } from "../testUtils";
import EditPlaylist from "./EditPlaylist";
import playlistsApi from "../api/playlistsApi";

// Mock API and navigation
jest.mock("../api/playlistsApi");
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useParams: () => ({ id: "playlist123" }),
    useNavigate: () => mockNavigate,
  };
});

// Sample playlist data returned by mocked API
const mockPlaylist = {
  name: "Test Playlist",
  description: "A test playlist description",
  imageUrl: "http://example.com/image.png",
  isPrivate: true,
  password: "secret",
};

// Mock the API responses for each test
beforeEach(() => {
  playlistsApi.getPlaylistById.mockResolvedValue({ playlist: mockPlaylist });
  playlistsApi.updatePlaylist.mockResolvedValue({});
});

describe("EditPlaylist", () => {
  // This test verifies that the playlist details are correctly loaded
  // and displayed in the form fields when the component mounts
  test("loads and displays the playlist info", async () => {
    renderWithAuthAndRouter(<EditPlaylist />, {
      route: "/playlists/playlist123/edit",
      path: "/playlists/:id/edit",
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Playlist")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("A test playlist description")
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("http://example.com/image.png")
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("secret")).toBeInTheDocument();
      expect(screen.getByLabelText("Private Playlist")).toBeChecked();
    });
  });

  // This test verifies that submitting the form:
  // - updates the playlist using the API
  // - redirects the user to the updated playlist's detail page
  test("submits updated playlist and navigates", async () => {
    renderWithAuthAndRouter(<EditPlaylist />, {
      route: "/playlists/playlist123/edit",
      path: "/playlists/:id/edit",
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Playlist")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Updated Playlist", name: "name" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(playlistsApi.updatePlaylist).toHaveBeenCalledWith(
        "playlist123",
        expect.objectContaining({ name: "Updated Playlist" }),
        "test-token"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/playlists/playlist123");
    });
  });
});
