import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "../Layouts/DashboardLayout";
import { HomePage } from "../Pages/HomePage/HomePage";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <HomePage /> },
    ],
  },
]);

export default router;
