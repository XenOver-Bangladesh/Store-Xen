# Purchase Order (PO) Management Module

## 📁 Structure

This module is organized into separate, manageable components for maintainability:

```
POPages/
├── ManagePO.jsx                 # Main page - orchestrates all components
├── components/
│   ├── POForm.jsx              # Create/Edit PO modal form
│   ├── POList.jsx              # PO table with actions
│   ├── POItemsTable.jsx        # Dynamic items table with react-select
│   └── POSummary.jsx           # Order summary with tax calculation
├── services/
│   └── poService.js            # API calls & axios configuration
├── utils/
│   └── poHelpers.js            # Helper functions & validation
└── README.md                    # This file

```

## 🎯 Features Implemented

### ✅ All Requirements Met

1. **Searchable Dropdowns** (react-select)
   - Supplier dropdown with type-to-search
   - Product dropdown with type-to-search
   - Auto-fills price when product selected

2. **PO Number Auto-Generation**
   - Frontend: `PO-{timestamp}-{random}`
   - Backend should handle this for production (prevents collisions)
   - Read-only field

3. **Dynamic Items Table**
   - ✅ Validation: quantity ≥ 1, price ≥ 0
   - ✅ Real-time subtotal calculation
   - ✅ Add/Remove items
   - ✅ "Create PO" disabled if no items

4. **Summary Section**
   - ✅ Live updates: subtotal, tax, total
   - ✅ Adjustable tax rate (0-100%)
   - ✅ Formatted currency display

5. **Notes Section**
   - ✅ Max 500 characters
   - ✅ Character counter
   - ✅ Visual warning at <50 chars remaining

6. **Action Buttons**
   - ✅ Cancel: Closes modal & clears form
   - ✅ Create/Update PO: Success toast & refresh list
   - ✅ Loading states

7. **PO List Table**
   - ✅ Color-coded status badges
   - ✅ View (detailed modal)
   - ✅ Edit (pre-fills form)
   - ✅ Send (confirmation dialog)
   - ✅ Delete (confirmation dialog)
   - ✅ Button labels with icons (not just icons)

## 🏗️ Component Breakdown

### `ManagePO.jsx` (Main Controller)
- Manages state for suppliers, products, POs
- Handles all CRUD operations
- Coordinates between components
- Clean, readable ~400 lines (was ~700)

### `POForm.jsx` (Modal Form)
- Searchable supplier/product dropdowns
- Date validation
- Integrates POItemsTable & POSummary
- Form validation before submit

### `POList.jsx` (Table Component)
- Uses SharedTable
- Custom cell renderers
- Action buttons with labels

### `POItemsTable.jsx` (Items Management)
- React-select for products
- Real-time validation
- Quantity/price validation
- Subtotal auto-calculation

### `POSummary.jsx` (Order Totals)
- Live calculation
- Adjustable tax rate
- Beautiful gradient design

### `poService.js` (API Layer)
- Axios instance with interceptors
- Centralized API calls
- Error handling
- Timeout configuration

### `poHelpers.js` (Utilities)
- Status color mapping
- Currency formatting
- Date formatting
- Form validation
- PO number generation

## 🔌 API Endpoints

Base URL: `https://pos-system-management-server-20.vercel.app`

### Suppliers
- `GET /suppliers` - Get all suppliers

### Products
- `GET /products` - Get all products

### Purchase Orders
- `GET /purchase-orders` - Get all POs
- `POST /purchase-orders` - Create PO
- `PUT /purchase-orders/:id` - Update PO
- `DELETE /purchase-orders/:id` - Delete PO
- `PATCH /purchase-orders/:id/send` - Send PO to supplier

## 🎨 UI/UX Features

- **Searchable Dropdowns**: Type to filter long lists
- **Real-time Validation**: Instant feedback
- **Loading States**: Button spinners during API calls
- **Empty States**: Helpful messages when no data
- **Confirmation Dialogs**: Prevent accidental actions
- **Success Toasts**: Auto-dismiss after 2 seconds
- **Responsive Design**: Works on mobile & desktop
- **Color-coded Status**: Visual status indicators
- **Character Limits**: Prevents database overflow

## 🔒 Validation Rules

### PO Form
- Supplier: Required
- Expected Delivery Date: Required
- Items: At least 1 required

### Item Validation
- Product: Required
- Quantity: ≥ 1
- Unit Price: ≥ 0

### Notes
- Max 500 characters
- Optional field

## 📊 Status Colors

- 🟡 **Pending**: Yellow (initial state)
- 🔵 **Sent**: Blue (after sending to supplier)
- 🟢 **Completed**: Green (order fulfilled)
- 🔴 **Cancelled**: Red (order cancelled)

## 🚀 Usage Example

```jsx
import ManagePO from './Pages/POPages/ManagePO'

function App() {
  return <ManagePO />
}
```

## 🛠️ Dependencies

- `react-select` - Searchable dropdowns
- `sweetalert2` - Beautiful alerts
- `axios` - HTTP client
- `lucide-react` - Icons
- Custom shared components:
  - `SharedModal`
  - `SharedTable`
  - `Button`

## 📝 Future Enhancements

1. **Backend PO Number Generation**: Move to API for uniqueness
2. **Export to PDF**: Generate printable PO documents
3. **Email Integration**: Auto-send PO to supplier email
4. **File Attachments**: Allow uploading documents
5. **PO Templates**: Save common PO configurations
6. **Approval Workflow**: Multi-level PO approval
7. **Stock Integration**: Check stock before creating PO
8. **Price History**: Track price changes over time

## 🐛 Troubleshooting

### Issue: Dropdowns not searching
**Solution**: Ensure `react-select` is installed: `npm install react-select`

### Issue: API calls failing
**Solution**: Check API base URL in `poService.js` and network connectivity

### Issue: Form not submitting
**Solution**: Check validation errors in console and ensure all required fields are filled

### Issue: Items not calculating
**Solution**: Ensure quantity and unitPrice are numbers, not strings

## 📱 Mobile Responsiveness

- Header stacks on mobile
- Table scrolls horizontally
- Modal adjusts to screen size
- Buttons resize appropriately
- Touch-friendly hit areas

## 🎯 Performance

- Lazy loading with React.lazy (if needed)
- Memoized calculations
- Debounced search in dropdowns
- Optimistic UI updates
- Minimal re-renders

---

**Author**: AI Assistant  
**Last Updated**: October 2025  
**Version**: 2.0.0

