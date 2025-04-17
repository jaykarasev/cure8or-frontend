import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithAuthAndRouter } from "../testUtils";
import CreatePlaylist from "./CreatePlaylist";
import playlistsApi from "../api/playlistsApi";

// Mock the API and navigation
jest.mock("../api/playlistsApi");
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe("CreatePlaylist", () => {
  // This test verifies that all necessary form inputs are rendered properly
  test("renders form inputs", () => {
    renderWithAuthAndRouter(<CreatePlaylist />, {
      route: "/create",
      path: "/create",
    });

    expect(screen.getByPlaceholderText("Playlist Name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Playlist Description")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Cover Image URL")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create playlist/i })
    ).toBeInTheDocument();
  });

  // This test verifies that checking the "Private Playlist" checkbox
  // dynamically displays the password input field
  test("shows password input when private is checked", () => {
    renderWithAuthAndRouter(<CreatePlaylist />, {
      route: "/create",
      path: "/create",
    });

    const checkbox = screen.getByLabelText(/private playlist/i);
    fireEvent.click(checkbox);

    expect(
      screen.getByPlaceholderText("Playlist Password")
    ).toBeInTheDocument();
  });

  // This test verifies that submitting the form:
  // - calls the `createPlaylist` API with the correct data
  // - redirects the user to the "/playlists" page upon success
  test("submits form and navigates", async () => {
    playlistsApi.createPlaylist.mockResolvedValue({});

    renderWithAuthAndRouter(<CreatePlaylist />, {
      route: "/create",
      path: "/create",
    });

    fireEvent.change(screen.getByPlaceholderText("Playlist Name"), {
      target: { value: "Road Trip" },
    });
    fireEvent.change(screen.getByPlaceholderText("Playlist Description"), {
      target: { value: "Vibes for the open road" },
    });
    fireEvent.change(screen.getByPlaceholderText("Cover Image URL"), {
      target: { value: "http://image.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create playlist/i }));

    await waitFor(() => {
      expect(playlistsApi.createPlaylist).toHaveBeenCalledWith(
        {
          name: "Road Trip",
          description: "Vibes for the open road",
          imageUrl: "http://image.com",
          isPrivate: false,
          password: null,
        },
        "test-token"
      );

      expect(mockNavigate).toHaveBeenCalledWith("/playlists");
    });
  });
});
