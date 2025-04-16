import React from "react";
import { render, screen } from "@testing-library/react";
import PlaylistCard from "./PlaylistCard";
import { MemoryRouter } from "react-router-dom";

// This test checks that a public playlist is rendered correctly.
// It verifies the playlist name, its public label, and the presence of the "View" button.
it("renders public playlist", () => {
  const playlist = {
    id: 1,
    name: "Summer Vibes",
    description: "Chill tracks for warm days",
    isPrivate: false,
  };

  render(
    <MemoryRouter>
      <PlaylistCard playlist={playlist} />
    </MemoryRouter>
  );

  expect(screen.getByText("Summer Vibes")).toBeInTheDocument();
  expect(screen.getByText("Public")).toBeInTheDocument();
  expect(screen.getByText("View")).toBeInTheDocument();
});

// This test checks that a private playlist is rendered with the "Private" label.
// It ensures the label is correctly displayed for private playlists.
it("renders private playlist", () => {
  const playlist = {
    id: 2,
    name: "Private Jams",
    description: "Only for close friends",
    isPrivate: true,
  };

  render(
    <MemoryRouter>
      <PlaylistCard playlist={playlist} />
    </MemoryRouter>
  );

  expect(screen.getByText("Private")).toBeInTheDocument();
});
