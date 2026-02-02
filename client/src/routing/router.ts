import { createBrowserRouter } from "react-router";

import RootLayout from "@/routing/RootLayout";
import DashboardLayout from "./DashboardLayout";

import Home from "@/pages/Home";
import MainDash from "@/pages/dashboard/MainDash";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, id: "home", Component: Home },
      {
        path: "/dashboard",
        Component: DashboardLayout, 
        children: [
          { index: true, Component: MainDash },
        ]
      }
    ]
  },
]);

export default router;