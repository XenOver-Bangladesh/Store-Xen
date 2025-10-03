import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "../Layouts/DashboardLayout";
import { HomePage } from "../Pages/HomePage/HomePage";
import AddSuppliers from "../Pages/SuppliersPages/AddSuppliers";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/overview" replace />
      },
      {
        path: "/dashboard/overview",
        element: <HomePage /> 
      },
      {
        path: "/suppliers/manage",
        element: <AddSuppliers />
      }
    ],
  },
]);

export default router;
