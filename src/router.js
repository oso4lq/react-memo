import { createBrowserRouter } from "react-router-dom";
import { GamePage } from "./pages/GamePage/GamePage";
import { SelectLevelPage } from "./pages/SelectLevelPage/SelectLevelPage";
import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <SelectLevelPage />,
    },
    {
      path: "/game/:pairsCount",
      element: <GamePage />,
    },
    {
      path: "/leaderboard",
      element: <LeaderboardPage />,
    },
  ],

  { basename: "/react-memo" },
);
