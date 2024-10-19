import { createBrowserRouter } from "react-router-dom";
import Lessons from "../pages/Lessons";
import CountingFishGame from "../pages/games";
import MainLayout from "../layout/MainLayout";
import Identify3 from "../pages/Identify3";
import Hear3 from "../pages/Hear3";
import Learn3 from "../pages/learn3";
import Count3 from "../pages/count3";

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
    {
      path: "/identify3",
      element: <Identify3 />,
    },
    {
      path: "/hear3",
      element: <Hear3 />,
    },
    {
      path: "/learn3",
      element: <Learn3 />,
    },
    {
      path: "/count3",
      element: <Count3 />,
    }
  ]
}
  
]);