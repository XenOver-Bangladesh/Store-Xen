# Goods Receive Note (GRN) Module

## Overview
The GRN module allows you to receive goods from suppliers based on Purchase Orders (POs). It automatically updates inventory and creates payment records.

## Features

### ✅ Create GRN
- Select from sent Purchase Orders
- Auto-populate product items from selected PO
- Edit received quantities for each item
- Add batch numbers and expiry dates
- Real-time completion percentage calculation
- Automatic status determination

### ✅ Manage GRNs
- View all GRNs with filtering options
- Filter by status, supplier, date range
- Search by GRN number
- View detailed GRN information
- Edit pending GRNs
- Delete unapproved GRNs
- Approve received GRNs

### ✅ Inventory Management
- Automatically updates inventory when GRN is created
- Tracks batch numbers and expiry dates
- Maintains stock quantities per product

### ✅ Payment Tracking
- Automatically creates payment records when goods are received
- Tracks amount due based on received quantities
- 30-day default payment term

## File Structure

```
GRNPages/
├── GRNManage.jsx                 # Main page component
├── components/
│   ├── GRNForm.jsx              # Create/Edit form modal
│   ├── GRNList.jsx              # GRN list table
│   ├── GRNFilter.jsx            # Filter component
│   └── GRNItemsTable.jsx        # Items table with editable fields
├── services/
│   └── grnService.js            # API service layer
├── utils/
│   └── grnHelpers.js            # Helper functions
└── README.md                     # This file
```

## API Endpoints

### Frontend to Backend

#### GET `/grn`
Fetches all GRNs sorted by creation date (newest first).

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "grnNumber": "GRN-20251005-123456",
    "poId": "507f1f77bcf86cd799439012",
    "poNumber": "PO-1728123456789",
    "supplierId": "507f1f77bcf86cd799439013",
    "receivedDate": "2025-10-05",
    "items": [...],
    "status": "Received",
    "notes": "All items received in good condition",
    "createdAt": "2025-10-05T10:30:00.000Z",
    "updatedAt": "2025-10-05T10:30:00.000Z"
  }
]
```

#### GET `/grn/:id`
Fetches a single GRN by ID.

#### POST `/grn`
Creates a new GRN.

**Payload:**
```json
{
  "grnNumber": "GRN-20251005-123456",
  "poId": "507f1f77bcf86cd799439012",
  "poNumber": "PO-1728123456789",
  "supplierId": "507f1f77bcf86cd799439013",
  "receivedDate": "2025-10-05",
  "items": [
    {
      "id": 1728123456789,
      "productId": "P001",
      "productName": "Product A",
      "orderedQty": 100,
      "receivedQty": 100,
      "batch": "BATCH-001",
      "expiry": "2026-10-05",
      "unitPrice": 10.50
    }
  ],
  "notes": "All items received",
  "status": "Received"
}
```

**Backend Actions:**
1. Creates GRN record
2. Updates inventory (adds received quantities)
3. Updates PO status:
   - "Received" if all items fully received
   - "Partially Received" if some items received
4. Creates payment record with status "Due"

**Response:**
```json
{
  "message": "GRN created successfully",
  "result": {...},
  "grnId": "507f1f77bcf86cd799439011"
}
```

#### PUT `/grn/:id`
Updates an existing GRN.

#### DELETE `/grn/:id`
Deletes a GRN (only if not approved).

**Backend Actions:**
1. Reverts inventory changes
2. Updates PO status back to "Sent"
3. Deletes related payment record
4. Deletes GRN

#### PATCH `/grn/:id/approve`
Approves a GRN, finalizing the receipt.

## GRN Statuses

| Status | Description |
|--------|-------------|
| `Pending` | GRN created but no items received yet |
| `Partially Received` | Some items received but not all |
| `Received` | All items fully received |
| `Approved` | GRN approved and finalized |

## Form Validation

The GRN form validates:
- ✅ Purchase Order is selected
- ✅ Received date is provided
- ✅ At least one item exists
- ✅ Received quantity doesn't exceed ordered quantity
- ✅ Received quantity is not negative
- ✅ At least one item has received quantity > 0

## Database Collections

### GRN Collection
```javascript
{
  grnNumber: String,          // Auto-generated
  poId: String,               // Reference to PO
  poNumber: String,           // For display
  supplierId: String,         // Reference to supplier
  receivedDate: Date,         // When goods received
  items: [{
    productId: String,
    productName: String,
    orderedQty: Number,
    receivedQty: Number,
    batch: String,            // Optional
    expiry: Date,             // Optional
    unitPrice: Number
  }],
  status: String,             // Pending, Partially Received, Received, Approved
  notes: String,              // Optional
  approvedAt: Date,           // When approved
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Collection
```javascript
{
  productId: String,          // Reference to product
  productName: String,
  stockQty: Number,           // Current stock
  batch: String,              // Latest batch
  expiry: Date,               // Latest expiry
  location: String,           // Warehouse location
  createdAt: Date,
  updatedAt: Date
}
```

### Payments Collection
```javascript
{
  poId: String,               // Reference to PO
  grnId: String,              // Reference to GRN
  supplierId: String,         // Reference to supplier
  poNumber: String,
  grnNumber: String,
  amountDue: Number,          // Total amount to pay
  amountPaid: Number,         // Amount paid so far
  status: String,             // Due, Partial, Paid
  dueDate: Date,              // Payment due date (default 30 days)
  paidAt: Date,               // When fully paid
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Example

### Creating a GRN

1. Click "New GRN" button
2. Select a Purchase Order from dropdown (only "Sent" POs shown)
3. Items from PO will auto-populate
4. Enter received date
5. For each item:
   - Enter received quantity (editable)
   - Optionally add batch number
   - Optionally add expiry date
6. Add notes if needed
7. Click "Create GRN"

### Viewing GRN Details

Click the eye icon (👁️) on any GRN row to see:
- Full GRN details
- Supplier information
- All items with quantities
- Batch numbers and expiry dates
- Completion percentage
- Notes

### Approving a GRN

1. Only GRNs with status "Received" can be approved
2. Click the approve button (✓)
3. Confirm approval
4. Status changes to "Approved"
5. GRN becomes read-only and cannot be deleted

## Helper Functions

### `validateGRNForm(formData)`
Validates GRN form data before submission.

### `determineGRNStatus(items)`
Determines status based on received quantities.

### `calculateReceivedPercentage(items)`
Calculates completion percentage.

### `generateGRNNumber()`
Generates unique GRN number: `GRN-YYYYMMDD-XXXXXX`

### `formatDate(dateString)`
Formats date for display: `Oct 5, 2025`

### `getStatusColor(status)`
Returns Tailwind classes for status badge colors.

## Best Practices

1. **Always approve GRNs** after verifying goods are in good condition
2. **Add batch numbers** for products with batches
3. **Add expiry dates** for perishable items
4. **Use notes field** to document any discrepancies or issues
5. **Review inventory** after creating GRN to verify stock updates

## Error Handling

The module includes comprehensive error handling:
- Form validation with user-friendly messages
- API error handling with SweetAlert2 notifications
- Network error handling
- Graceful degradation when data is unavailable

## Dependencies

- React 18+
- Axios (API calls)
- SweetAlert2 (notifications)
- Lucide React (icons)
- TanStack Table (data tables)
- Tailwind CSS (styling)

## Future Enhancements

- [ ] Print GRN as PDF
- [ ] Email GRN to supplier
- [ ] Barcode scanning for items
- [ ] Photo upload for received goods
- [ ] Quality inspection checklist
- [ ] Multiple warehouse support
- [ ] Return/reject damaged goods
- [ ] GRN analytics and reports

