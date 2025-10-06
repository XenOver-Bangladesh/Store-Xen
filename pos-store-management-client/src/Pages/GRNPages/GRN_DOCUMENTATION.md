# 📦 GRN (Goods Receive Note) Module - Complete Documentation

## 🎯 Overview

The GRN module is a comprehensive system for receiving and tracking goods from suppliers based on Purchase Orders (PO). It automatically updates inventory and manages payment tracking.

---

## ✨ Key Features

### 1️⃣ **GRN Creation & Management**
- ✅ Create GRN from existing Purchase Orders
- ✅ Track cumulative received quantities across multiple GRNs
- ✅ Automatic validation to prevent over-receiving
- ✅ Batch and expiry date tracking
- ✅ Real-time inventory updates

### 2️⃣ **Intelligent Status Management**
- **Pending**: GRN created but no items received
- **Partially Received**: Some items received (not all quantities)
- **Received**: All items fully received
- **Approved**: GRN finalized (cannot be edited/deleted)

### 3️⃣ **Purchase Order Integration**
- Automatic PO status updates:
  - **Sent** → **Partially Received** → **Fully Received**
- Cumulative tracking across multiple GRNs for the same PO
- Prevents receiving more than ordered quantities

### 4️⃣ **Inventory Management**
- Real-time stock updates on GRN creation
- Batch number tracking for traceability
- Expiry date management for perishable goods
- Automatic inventory creation for new products

### 5️⃣ **Payment Tracking**
- Automatic payment record creation when items are received
- Payment amount calculation based on received quantities
- Updates payment amount when additional GRNs are created
- Integration with the Payments module

---

## 🔄 Complete Workflow

### **Step 1: Create Purchase Order**
1. Navigate to **Suppliers → Purchase Orders**
2. Create a PO with items and quantities
3. Send the PO to the supplier (Status: **Sent**)

### **Step 2: Create GRN**
1. Navigate to **Suppliers → Goods Receive Note (GRN)**
2. Click **"+ New GRN"** button
3. Select a Purchase Order from the dropdown
   - Only **Sent** and **Partially Received** POs are shown
4. The system automatically loads:
   - **Ordered Qty**: Total quantity from PO
   - **Already Received**: Sum from all previous GRNs
   - **Remaining**: Available quantity to receive

### **Step 3: Enter Received Quantities**
1. For each product, enter the **Received Qty**
   - Input is limited to the remaining quantity
   - Products with 0 remaining are disabled
2. Optionally add:
   - **Batch Number**: For product tracking
   - **Expiry Date**: For perishable items
3. Add notes if needed (optional)

### **Step 4: Submit GRN**
- Click **"Create GRN"** button
- The system performs:
  - ✅ Validation checks
  - ✅ Inventory stock update
  - ✅ PO status update
  - ✅ Payment record creation/update

### **Step 5: View & Manage**
- **View**: See complete GRN details
- **Edit**: Modify pending GRNs
- **Delete**: Remove non-approved GRNs (reverts inventory)
- **Approve**: Finalize received GRNs

---

## 📊 Example Scenario

### Scenario: Receiving goods in multiple shipments

**Initial Purchase Order:**
- **PO Number**: PO-2025-001
- **Products**:
  - Product A: 100 units
  - Product B: 50 units

#### **GRN #1 (First Shipment)**
- **Received**:
  - Product A: 60 units
  - Product B: 20 units
- **Result**:
  - PO Status: **Partially Received**
  - Inventory: +60 Product A, +20 Product B
  - Payment: Created for 60 + 20 units

#### **GRN #2 (Second Shipment)**
- **Available to receive**:
  - Product A: 40 units remaining (100 - 60)
  - Product B: 30 units remaining (50 - 20)
- **Received**:
  - Product A: 40 units
  - Product B: 30 units
- **Result**:
  - PO Status: **Fully Received**
  - Inventory: +40 Product A, +30 Product B
  - Payment: Updated to reflect all received items

---

## 🛡️ Validation Rules

### ✅ **Creating GRN**
1. Must select a valid Purchase Order
2. PO must be in **Sent** or **Partially Received** status
3. At least one item must have received quantity > 0
4. Received quantity cannot exceed remaining quantity
5. Received date cannot be in the future

### ✅ **Editing GRN**
- Only **Pending** status GRNs can be edited
- Cannot change the associated Purchase Order
- Same validation rules as creation apply

### ✅ **Deleting GRN**
- Cannot delete **Approved** GRNs
- Deletion automatically:
  - Reverts inventory changes
  - Recalculates PO status
  - Updates or deletes payment records

---

## 🔧 Technical Details

### **Backend API Endpoints**

```
GET    /grn                        - Get all GRNs
GET    /grn/:id                    - Get single GRN
GET    /grn/po/:poId/received      - Get cumulative received for a PO
POST   /grn                        - Create new GRN
PUT    /grn/:id                    - Update GRN
DELETE /grn/:id                    - Delete GRN
PATCH  /grn/:id/approve            - Approve GRN
```

### **Database Collections**
- `grn` - GRN records
- `purchaseOrders` - Purchase orders
- `inventory` - Stock levels
- `payments` - Payment records
- `suppliers` - Supplier information

### **Key Algorithms**

#### **Cumulative Quantity Tracking**
```javascript
// For each product in PO:
const alreadyReceived = sum(all previous GRNs for this product)
const remainingQty = orderedQty - alreadyReceived
const canReceive = min(requestedQty, remainingQty)
```

#### **PO Status Determination**
```javascript
if (all products fully received) {
  status = "Fully Received"
} else if (some products partially received) {
  status = "Partially Received"
} else {
  status = "Sent"
}
```

#### **Payment Calculation**
```javascript
totalAmount = sum(receivedQty × unitPrice for all products)
taxAmount = totalAmount × (taxRate / 100)
finalAmount = totalAmount + taxAmount
```

---

## 🎨 UI Components

### **GRNManage.jsx**
Main page container with:
- Header with statistics
- Filter section
- GRN list table
- Modal for create/edit forms

### **GRNList.jsx**
Table display with columns:
- GRN Number
- PO Number
- Supplier
- Received Date
- Items count
- Total Received
- Status
- Actions (View/Edit/Delete/Approve)

### **GRNForm.jsx**
Create/Edit form with:
- Basic information (GRN number, PO selection, date)
- Summary statistics
- Items table
- Notes field

### **GRNItemsTable.jsx**
Product items table showing:
- Product Name
- Ordered Qty
- Already Received (from previous GRNs)
- Remaining (available to receive)
- Received Qty (editable input)
- Batch Number
- Expiry Date
- Status

### **GRNFilter.jsx**
Advanced filtering by:
- Status
- Supplier
- Date range
- Search by GRN number

---

## 🚀 Quick Start

### **Prerequisites**
1. Ensure MongoDB is running
2. Backend server is running on Vercel
3. Frontend React app is running

### **First Time Setup**
1. Create suppliers in **Suppliers → Manage Suppliers**
2. Create products in **Products → Manage Products**
3. Create a Purchase Order in **Suppliers → Purchase Orders**
4. Send the PO to the supplier
5. Navigate to **Suppliers → Goods Receive Note (GRN)**
6. Start creating GRNs as goods arrive

---

## 📝 Best Practices

### ✅ **DO**
- Create GRNs as soon as goods arrive
- Add batch numbers and expiry dates for traceability
- Review and approve GRNs promptly
- Add notes for any discrepancies or issues
- Use multiple GRNs for partial shipments

### ❌ **DON'T**
- Don't receive more than ordered quantities
- Don't delete approved GRNs
- Don't skip batch/expiry information for perishable goods
- Don't create GRNs without verifying physical goods

---

## 🐛 Troubleshooting

### **Problem: Cannot select a Purchase Order**
**Solution**: Ensure the PO status is **Sent** or **Partially Received**. Fully received POs cannot receive more goods.

### **Problem: Cannot enter received quantity**
**Solution**: Check if the remaining quantity is 0. All items from that PO have already been received.

### **Problem: Validation error on submit**
**Solution**: Ensure received quantities don't exceed remaining quantities and at least one item has qty > 0.

### **Problem: Inventory not updating**
**Solution**: Check backend logs for errors. Ensure product IDs match between PO and inventory.

---

## 🔐 Security & Permissions

- Only authorized users can create/edit GRNs
- Approved GRNs are locked from editing/deletion
- All actions are logged with timestamps
- Payment records are automatically protected

---

## 📈 Future Enhancements

- [ ] Multi-warehouse support
- [ ] QR code scanning for batch tracking
- [ ] Email notifications on GRN creation
- [ ] Advanced reporting and analytics
- [ ] Export GRN to PDF
- [ ] Integration with accounting systems
- [ ] Mobile app for receiving goods
- [ ] Barcode scanning support

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review the QUICK_START.md guide
3. Check backend logs for errors
4. Contact system administrator

---

**Version**: 1.0.0  
**Last Updated**: October 6, 2025  
**Module Status**: ✅ Production Ready

