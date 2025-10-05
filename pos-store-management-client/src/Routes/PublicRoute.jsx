import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "../Layouts/DashboardLayout";
import { HomePage } from "../Pages/HomePage/HomePage";
import SupplierPages from "../Pages/SuppliersPages/SupplierPages";
import ProductAdd from "../Pages/ProductPages/ProductAdd";
import ProductManage from "../Pages/ProductPages/ProductManage";
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
      //dashboard
      {
        path: "/dashboard/overview",
        element: <HomePage /> 
      },
      //suppliers
      {
        path: "/suppliers/manage",
        element: <SupplierPages />
      },
      //products
      {
        path: "/products/manage",
        element: <ProductManage />
      },
      {
        path: "/products/add",
        element: <ProductAdd />
      }
      
    ],
  },
]);

export default router;
