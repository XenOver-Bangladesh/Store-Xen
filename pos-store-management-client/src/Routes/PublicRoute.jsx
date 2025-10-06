import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "../Layouts/DashboardLayout";
import { HomePage } from "../Pages/HomePage/HomePage";
import SupplierPages from "../Pages/SuppliersPages/SupplierPages";
import ProductAdd from "../Pages/ProductPages/ProductAdd";
import ProductManage from "../Pages/ProductPages/ProductManage";
import ManagePO from "../Pages/POPages/ManagePO";
import GRNManage from "../Pages/GRNPages/GRNManage";
import Payments from "../Pages/GENPaymentsPage/Payments";
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
      {
        path: "/suppliers/purchase-orders",
        element: <ManagePO />
      },
      {
        path: "/suppliers/grn",
        element: <GRNManage />
      },
      {
        path: "/suppliers/payments",
        element: <Payments />
      },
      //products
      {
        path: "/products/manage",
        element: <ProductManage />
      },
      {
        path: "/products/add",
        element: <ProductAdd />
      },
    ],
  },
]);

export default router;
