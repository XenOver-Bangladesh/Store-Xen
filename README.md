# 🏪 Store-Xen POS Management System

A comprehensive, full-stack Point of Sale (POS) Store Management System with advanced inventory tracking, supplier management, procurement workflows, and warehouse operations.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.1.14-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌐 Live Demo

**Frontend:** https://store-xen.vercel.app/ 
**Backend API:** https://pos-system-management-server-20.vercel.app/  
**Server Status:** ✅ Online

---

## ✨ Key Features

### 🔐 Authentication & User Management
- **Secure Login System** - Username/password authentication with session management
- **User Profile Management** - View and edit user information
- **Settings & Preferences** - Customize language, timezone, notifications, and display options
- **Protected Routes** - All dashboard features require authentication
- **Session Persistence** - Stay logged in across browser sessions

### 📦 Complete Procurement & Supply Chain Management
- **Purchase Order (PO) System** - Create, track, and send POs to suppliers
- **Goods Receive Notes (GRN)** - Multi-receipt support with batch & expiry tracking
- **Supplier Payments** - Track payments with Due/Partial/Paid status
- **Approval Workflows** - Independent approval for partial and full receipts

### 🏭 Warehouse & Inventory Management
- **Real-time Inventory** - Auto-update stock from GRN receipts
- **Multi-location Support** - Track products across warehouses
- **Batch & Expiry Tracking** - Monitor perishable goods
- **Low Stock Alerts** - Automated threshold-based warnings
- **Stock In History** - Complete audit trail of all receipts

### 👥 Supplier & Product Management
- **Supplier Database** - Complete contact & payment terms tracking
- **Product Catalog** - QR code generation, categories, images
- **Advanced Filtering** - Search, filter, and export data
- **Dual View Modes** - Table and card layouts

### 💰 Financial Tracking
- **Payment Records** - Track supplier payments by GRN
- **Payment History** - Full audit trail with transaction IDs
- **Multiple Payment Methods** - Cash, Bank, Mobile, Cheque, Credit Card
- **Due Date Management** - Automatic payment reminders

---

## 🚀 Technology Stack

### Frontend
- **React 19.1.1** - Modern UI library with hooks
- **React Router DOM 7.9.3** - Client-side routing with protected routes
- **Tailwind CSS 4.1.14** - Utility-first styling
- **TanStack Table 8.21.3** - Advanced data tables with sorting/pagination
- **Axios 1.12.2** - HTTP client
- **SweetAlert2 11.23.0** - Beautiful alerts & modals
- **Context API** - Authentication state management
- **LocalStorage** - Session persistence

### Backend
- **Node.js + Express** - REST API server
- **MongoDB** - NoSQL database
- **Vercel Serverless** - Cloud deployment

### DevOps
- **Vite 7.1.7** - Fast build tool
- **ESLint** - Code quality
- **Git** - Version control

---

## 📊 System Modules

### 1. Purchase Management
- Create and manage purchase orders
- Send POs to suppliers (email integration ready)
- Track PO status: Pending → Sent → Partially Received → Fully Received
- Multi-level sorting (newest first)
- Pagination support

### 2. Goods Receipt
- Create GRNs from sent POs
- Support multiple receipts per PO
- Automatic inventory update on receipt
- Batch number and expiry date tracking
- Cumulative quantity validation
- Independent approval for audit trail

### 3. Inventory Control
- Real-time stock levels
- Low stock and out-of-stock indicators
- Expiring soon alerts (30-day warning)
- Product details with SKU tracking
- Multi-warehouse location support

### 4. Payment Management
- Auto-create payment records on GRN approval
- Record partial and full payments
- Payment history with transaction references
- Status tracking: Due → Partial → Paid
- Supplier payment overview

### 5. Stock In Review
- View all GRN-approved stock entries
- Historical audit trail
- Batch and expiry information
- Stock entry verification

---

## 🎯 Workflow

```
1. Create Supplier → 2. Create Products → 3. Create Purchase Order
                                                    ↓
                                              4. Send PO to Supplier
                                                    ↓
                                              5. Create GRN (Receive Goods)
                                                    ↓
                                         ┌─────────┴─────────┐
                                         ↓                   ↓
                              6. Inventory Updated    7. Payment Record Created
                                         ↓                   ↓
                              8. Stock Available     9. Record Payment
                                         ↓                   ↓
                              10. Approve GRN       11. Payment Complete
```

---

## 📁 Project Structure

```
Store-Xen/
├── pos-store-management-client/     # React Frontend
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── ProductPages/        # Product management
│   │   │   ├── SuppliersPages/      # Supplier management
│   │   │   ├── POPages/             # Purchase Orders
│   │   │   ├── GRNPages/            # Goods Receive Notes
│   │   │   ├── GENPaymentsPage/     # Supplier Payments
│   │   │   ├── InStockProductPages/ # Warehouse Inventory
│   │   │   └── StockInPages/        # Stock In History
│   │   ├── Components/              # Reusable UI components
│   │   ├── Shared/                  # Shared components (Table, Modal, Filter)
│   │   ├── Layouts/                 # Layout components
│   │   └── Routes/                  # Route configuration
│   └── package.json
│
└── POS-store-management-server/     # Node.js Backend
    └── server/
        └── api/
            └── index.js             # Express API routes
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- ImgBB API Key (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Store-Xen
   ```

2. **Install frontend dependencies**
   ```bash
   cd pos-store-management-client
   npm install
   ```

3. **Configure environment variables**
   ```env
   # Frontend (.env)
   VITE_IMGBB_API_KEY=your_imgbb_api_key
   VITE_API_BASE_URL=https://pos-system-management-server-20.vercel.app
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 📡 API Endpoints

### Products
- `GET /products` - Fetch all products
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Suppliers
- `GET /suppliers` - Fetch all suppliers
- `POST /suppliers` - Create supplier
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

### Purchase Orders
- `GET /purchase-orders` - Fetch all POs
- `POST /purchase-orders` - Create PO
- `PUT /purchase-orders/:id` - Update PO
- `DELETE /purchase-orders/:id` - Delete PO
- `PATCH /purchase-orders/:id/send` - Send PO to supplier

### GRN (Goods Receive Notes)
- `GET /grn` - Fetch all GRNs
- `GET /grn/:id` - Get GRN by ID
- `GET /grn/po/:poId/received` - Get cumulative received quantities
- `POST /grn` - Create GRN (auto-updates inventory & creates payment)
- `PUT /grn/:id` - Update GRN
- `DELETE /grn/:id` - Delete GRN (reverts inventory)
- `PATCH /grn/:id/approve` - Approve GRN

### Inventory
- `GET /inventory` - Fetch all inventory
- `GET /inventory/product/:productId` - Get product inventory

### Payments
- `GET /payments` - Fetch all payments
- `GET /payments/:id` - Get payment by ID
- `PUT /payments/:id` - Update payment (record payment)

---

## 🎨 UI Features

✅ **Responsive Design** - Mobile, tablet, desktop optimized  
✅ **Modern Gradients** - Beautiful color schemes  
✅ **Smooth Animations** - Transitions and hover effects  
✅ **Loading States** - Skeletons and spinners  
✅ **Empty States** - Helpful no-data messages  
✅ **Pagination** - First/Prev/Next/Last controls (10 items/page)  
✅ **Sorting** - Multi-level fallback sorting (newest first)  
✅ **Filtering** - Advanced search and filter options  
✅ **Modals** - Beautiful SweetAlert2 dialogs  
✅ **Status Badges** - Color-coded status indicators  

---

## 🔐 Security Features

- **Authentication System** - Username/password login with session management
- **Protected Routes** - All dashboard features require authentication
- **Session Security** - Secure localStorage-based session persistence
- **Input Validation** - Client-side and server-side validation
- **MongoDB Injection Prevention** - Secure database queries
- **CORS Configuration** - Cross-origin request security
- **Error Handling** - Comprehensive error logging and user feedback
- **Data Integrity Checks** - Validation and sanitization

---

## 📈 Performance Optimizations

- Code splitting with React Router
- Lazy loading components
- Memoized expensive calculations
- Debounced search inputs
- Pagination for large datasets
- Efficient API calls with Axios
- Optimized re-renders

---

## 🗺️ Roadmap

- [x] Product Management
- [x] Supplier Management
- [x] Purchase Order System
- [x] GRN with Multi-Receipt Support
- [x] Inventory Management
- [x] Supplier Payments
- [x] Stock In History
- [x] Pagination & Sorting
- [x] Authentication System
- [x] User Profile Management
- [x] Settings & Preferences
- [x] Protected Routes
- [ ] Sales POS Terminal
- [ ] Customer Management
- [ ] Invoice Generation
- [ ] Barcode Scanning
- [ ] Receipt Printing
- [ ] Dashboard Analytics
- [ ] Multi-user & Role-based Access
- [ ] Email/SMS Notifications
- [ ] Stock Transfer Between Warehouses
- [ ] Reports & Analytics

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Authors

**Store-Xen Development Team**

---

## 🙏 Acknowledgments

- MongoDB for database
- Vercel for hosting
- ImgBB for image hosting
- QR Server for QR code generation
- React & Tailwind communities

---

## 📞 Support

For support, open an issue in the repository.

---

**Made with ❤️ by Store-Xen Team**

**Server Status:** ✅ Live at https://pos-system-management-server-20.vercel.app/
