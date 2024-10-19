import { createBrowserRouter } from "react-router-dom";
import Lessons from "../pages/Lessons";
import CountingFishGame from "../pages/games";
import MainLayout from "../layout/MainLayout";

export const router = createBrowserRouter([
 {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <Lessons />,
    },
    {
      path: "/games",
      element: <CountingFishGame />,
    },
  ]
}
  
]);