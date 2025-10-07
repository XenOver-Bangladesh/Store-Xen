import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "../Layouts/DashboardLayout";
import { HomePage } from "../Pages/HomePage/HomePage";
import SupplierPages from "../Pages/SuppliersPages/SupplierPages";
import ProductAdd from "../Pages/ProductPages/ProductAdd";
import ProductManage from "../Pages/ProductPages/ProductManage";
import ManagePO from "../Pages/POPages/ManagePO";
import GRNManage from "../Pages/GRNPages/GRNManage";
import Payments from "../Pages/GENPaymentsPage/Payments";
import { InStockProductPages } from "../Pages/InStockProductPages/InStockProductPages";
import StockInPages from "../Pages/StockInPages/StockInPages";
import WarehouseBarcode from "../Pages/WarehouseBarcode/WarehouseBarcode";
import WarehouseBatchtracking from "../Pages/WarehouseBatchtracking/WarehouseBatchtracking";
import WarehouseStocktransfer from "../Pages/WarehouseStocktransfer/WarehouseStocktransfer";
import WarehouseList from "../Pages/WarehouseList/WarehouseList";
import ScrollToTop from "../Components/ScrollToTop/ScrollToTop";
// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <DashboardLayout />
      </>
    ),
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
      //warehouse
      {
        path: "/warehouse/inhouse-products",
        element: <InStockProductPages />
      },
      {
        path: "/warehouse/stock-in",
        element: <StockInPages />
      },
      {
        path: "/warehouse/barcode",
        element: <WarehouseBarcode />
      },
      {
        path: "/warehouse/batch-tracking",
        element: <WarehouseBatchtracking />
      },
      {
        path: "/warehouse/stock-transfer",
        element: <WarehouseStocktransfer />
      },
      {
        path: "/warehouse/list",
        element: <WarehouseList />
      },
    ],
  },
]);

export default router;
