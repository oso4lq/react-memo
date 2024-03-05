import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ModeProvider } from "./context/ModeContext";
import { AchievementsProvider } from "./context/AchievementContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AchievementsProvider>
      <ModeProvider>
        <RouterProvider router={router}></RouterProvider>
      </ModeProvider>
    </AchievementsProvider>
  </React.StrictMode>,
);
