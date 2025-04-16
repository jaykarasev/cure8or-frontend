import React from "react";
import { screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { renderWithAuthAndRouter } from "../testUtils";

describe("Navbar", () => {
  // This test checks that when there is no user logged in,
  // the "Login" and "Sign Up" links are displayed in the navbar.
  it("renders links when logged out", () => {
    renderWithAuthAndRouter(<Navbar />, {
      authValue: { user: null, logout: jest.fn() },
    });

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  // This test checks that when a user is logged in,
  // the "Playlists", "Profile", and "Logout" links are displayed in the navbar.
  it("renders links when logged in", () => {
    const mockUser = { username: "testuser" };
    renderWithAuthAndRouter(<Navbar />, {
      authValue: { user: mockUser, logout: jest.fn() },
    });

    expect(screen.getByText("Playlists")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
