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
import PosTerminalPage from "../Pages/PosTerminal/PosTerminalPage";
import DiscountsPages from "../Pages/DiscountsPages/DiscountsPages";
import SalesPaymentPage from "../Pages/SalesPaymentPage/SalesPaymentPage";
import SalesInvoice from "../Pages/SalesInvoice/SalesInvoice";
import SalesReturn from "../Pages/SalesReturns/SalesReturn";
import InventoryPages from "../Pages/InventoryPages/InventoryPages";
import StockDashboard from "../Pages/InventoryPages/StockDashboard/StockDashboard";
import LowStockAlerts from "../Pages/InventoryPages/LowStockAlerts/LowStockAlerts";
import AutoReorderSuggestions from "../Pages/InventoryPages/AutoReorderSuggestions/AutoReorderSuggestions";
import InventoryValuation from "../Pages/InventoryPages/InventoryValuation/InventoryValuation";
import SalesReports from "../Pages/InventoryPages/SalesReports/SalesReports";
import ProfitLossReports from "../Pages/InventoryPages/ProfitLossReports/ProfitLossReports";
import StockAnalysis from "../Pages/InventoryPages/StockAnalysis/StockAnalysis";
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
      //sales
      {
        path: "/sales/pos-terminal",
        element: <PosTerminalPage />
      },
      {
        path: "/sales/discounts",
        element: <DiscountsPages />
      },
      {
        path: "/sales/payments",
        element: <SalesPaymentPage />
      },
      {
        path: "/sales/invoice",
        element: <SalesInvoice />
      },
      {
        path: "/sales/returns",
        element: <SalesReturn />
      },
      //inventory
      {
        path: "/inventory",
        element: <InventoryPages />
      },
      {
        path: "/inventory/stock-dashboard",
        element: <StockDashboard />
      },
      {
        path: "/inventory/low-stock",
        element: <LowStockAlerts />
      },
      {
        path: "/inventory/reorder",
        element: <AutoReorderSuggestions />
      },
      {
        path: "/inventory/valuation",
        element: <InventoryValuation />
      },
      {
        path: "/inventory/sales-reports",
        element: <SalesReports />
      },
      {
        path: "/inventory/profit-loss",
        element: <ProfitLossReports />
      },
      {
        path: "/inventory/stock-analysis",
        element: <StockAnalysis />
      },
      
    ],
  },
]);

export default router;
