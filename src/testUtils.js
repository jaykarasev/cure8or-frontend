import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Reusable render wrapper with AuthContext and MemoryRouter
export function renderWithAuthAndRouter(
  ui,
  {
    route = "/",
    path = "/",
    authValue = { user: { id: "user1" }, token: "test-token" },
  } = {}
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={authValue}>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}
