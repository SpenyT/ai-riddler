import { createBrowserRouter } from "react-router";

import RootLayout from "@/routing/RootLayout";
import DashboardLayout from "./DashboardLayout";
import AuthCallback from "@/components/auth/AuthCallback";

import Home from "@/pages/Home";
import MainDash from "@/pages/dashboard/MainDash";
import SignInPage from "@/pages/SignInPage";

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
  {
    path:"/sign-in",
    Component: SignInPage
  },
  {
    path:"/auth/callback",
    Component: AuthCallback
  }
]);

export default router;