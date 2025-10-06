# GRN Module - Real-Life Workflow Logic

## Overview
This document describes the improved, real-life workflow for the Goods Receive Note (GRN) module.

---

## ⚠️ CRITICAL: When Inventory Updates

### 🎯 **Inventory Updates IMMEDIATELY When GRN is Created**

**THIS IS THE MOST IMPORTANT CONCEPT TO UNDERSTAND:**

```
✅ CREATE GRN → INVENTORY UPDATED RIGHT NOW → Items Available Immediately
❌ NOT: Create GRN → Wait for Approval → Then Update Inventory
```

### What This Means:
- **When you create a GRN** (even "Partially Received") → Stock increases **INSTANTLY**
- **Items are available** for sale/use **RIGHT AWAY** (no waiting for approval)
- **Approval is for paperwork** (authorization, audit trail, locking the record)
- **Approval does NOT update inventory** (it was already updated when GRN was created)

### Real-Life Example:
```
Day 1: Create GRN with 50 units
  → Inventory: 50 units ✅ Available NOW
  → Status: "Partially Received"
  → Can sell these 50 units immediately!

Day 5: Create another GRN with 50 more units  
  → Inventory: 100 units total ✅ Available NOW
  → Status: "Fully Received"
  → All 100 units available!

Day 6: Manager approves
  → Inventory: Still 100 units (NO CHANGE)
  → Just locks the record for audit
```

**See [INVENTORY_UPDATE_LOGIC.md](./INVENTORY_UPDATE_LOGIC.md) for complete details.**

---

## Purchase Order (PO) Statuses

### 1. **Pending/Draft**
- PO is created but not sent to supplier
- **Actions Available:**
  - ✅ View
  - ✅ Edit
  - ✅ Send
  - ✅ Delete

### 2. **Sent**
- PO has been sent to supplier
- Waiting for goods to arrive
- **Actions Available:**
  - ✅ View
  - ❌ Edit (Cannot modify sent PO)
  - ❌ Send (Already sent)
  - ❌ Delete (Cannot delete sent PO)
- **Can Create GRN:** ✅ Yes

### 3. **Partially Received**
- Some items have been received via GRN(s)
- Still waiting for remaining items
- **Actions Available:**
  - ✅ View
  - ❌ Edit (Cannot modify PO with received items)
  - ❌ Send (Already sent)
  - ❌ Delete (Cannot delete PO with received items)
- **Can Create GRN:** ✅ Yes (for remaining items)

### 4. **Fully Received**
- All items have been received via GRN(s)
- PO is complete
- **Actions Available:**
  - ✅ View ONLY
  - ❌ Edit (All items received)
  - ❌ Send (Already sent)
  - ❌ Delete (Cannot delete completed PO)
- **Can Create GRN:** ❌ No (all items already received)

---

## Goods Receive Note (GRN) Statuses

### 1. **Pending**
- GRN created but no items received yet
- This status should rarely occur (edge case)
- **Actions Available:**
  - ✅ View
  - ✅ Edit
  - ❌ Approve (No items received)
  - ✅ Delete

### 2. **Partially Received**
- Some items received, but not all items from the PO are fully received yet
- Example: Ordered 100 units, received 50 in this GRN
- **Actions Available:**
  - ✅ View
  - ✅ Edit (Can adjust received quantities)
  - ❌ Approve (Cannot approve until ALL items fully received)
  - ✅ Delete
- **Effect on PO:** PO status becomes "Partially Received"

### 3. **Fully Received**
- ALL items from the PO have been fully received (cumulative across all GRNs)
- Ready for approval
- **Actions Available:**
  - ✅ View
  - ❌ Edit (Cannot edit after full receipt)
  - ✅ **Approve** (This is when you can approve!)
  - ✅ Delete (if not yet approved)
- **Effect on PO:** PO status becomes "Fully Received"

### 4. **Approved**
- GRN has been approved by authorized personnel
- Final and locked
- **Actions Available:**
  - ✅ View ONLY
  - ❌ Edit
  - ❌ Approve (Already approved)
  - ❌ Delete (Cannot delete approved records)

---

## Workflow Scenarios

### Scenario 1: Full Receipt in One GRN
1. Create PO with 3 items (100 units each)
2. Send PO to supplier → Status: **Sent**
3. Goods arrive, all items received
4. Create GRN, receive all 100 units for each item
   - **Inventory: +300 units IMMEDIATELY** ✅
   - Items available for sale RIGHT NOW
5. GRN Status: **Fully Received** ✅
6. PO Status: **Fully Received**
7. **Approve GRN** → GRN Status: **Approved**
   - Inventory: No change (already updated)
   - Locks GRN for audit purposes
8. Payment record finalized

### Scenario 2: Partial Receipt Across Multiple GRNs
1. Create PO with Item A (100 units), Item B (200 units)
2. Send PO → Status: **Sent**
3. First delivery arrives with Item A (50 units), Item B (100 units)
4. Create GRN #1
   - **Inventory: +150 units IMMEDIATELY** ✅
   - These 150 units available for sale RIGHT NOW
5. GRN #1 Status: **Partially Received** (not all items fully received)
6. PO Status: **Partially Received**
7. Second delivery arrives with Item A (50 units), Item B (100 units)
8. Create GRN #2
   - **Inventory: +150 more units IMMEDIATELY** ✅
   - Total 300 units now available
9. GRN #2 Status: **Fully Received** ✅ (all items now fully received)
10. PO Status: **Fully Received**
11. **Approve GRN #2** → Status: **Approved**
    - Inventory: No change (was already updated in steps 4 & 8)
    - Just locks GRN for audit
12. Payment record finalized

### Scenario 3: Mixed Receipt
1. PO with Item A (100), Item B (200), Item C (150)
2. GRN #1: Item A (100 fully), Item B (100 partial), Item C (0)
   - Status: **Partially Received** ❌ No Approve Button
3. GRN #2: Item B (100 complete), Item C (150 fully)
   - Status: **Fully Received** ✅ Approve Button Appears
4. Approve GRN #2
5. Both GRNs contribute to PO completion

---

## Key Rules

### Approve Button Logic
- **Show Approve Button:** Only when GRN status is "Fully Received"
- **Hide Approve Button:** For "Partially Received" or "Pending" status
- **Reason:** You can only approve when ALL items from the PO are fully received (cumulative)

### Edit/Delete Logic for GRNs
- **Can Edit:** Only "Partially Received" GRNs
- **Cannot Edit:** "Fully Received" or "Approved" GRNs
- **Can Delete:** "Partially Received" or "Fully Received" GRNs (if not approved)
- **Cannot Delete:** "Approved" GRNs

### Edit/Delete Logic for POs
- **Can Edit:** Only "Pending/Draft" POs
- **Cannot Edit:** "Sent", "Partially Received", or "Fully Received" POs
- **Can Delete:** Only "Pending/Draft" POs
- **Cannot Delete:** POs with any received items

### Inventory Updates
- Inventory is updated immediately when GRN is created
- If GRN is deleted, inventory is automatically reverted
- Approved GRNs cannot be deleted to maintain inventory integrity

### Payment Records
- Payment record is created when first GRN is created for a PO
- Payment amount is updated cumulatively as more GRNs are added
- Payment record is deleted if all GRNs for a PO are deleted

---

## Status Transitions

### PO Status Flow
```
Pending/Draft → Sent → Partially Received → Fully Received
                         ↑                        ↓
                         └────────────────────────┘
                       (if GRN deleted and items remaining)
```

### GRN Status Flow
```
Create → Partially Received → Fully Received → Approved
         (can edit/delete)     (can approve)   (locked)
```

---

## Color Coding

### GRN Statuses
- 🟡 **Pending**: Yellow (rare)
- 🔵 **Partially Received**: Blue (work in progress)
- 🟣 **Fully Received**: Purple (ready for approval)
- 🟢 **Approved**: Green (finalized)

### PO Statuses
- 🟡 **Pending**: Yellow
- 🔵 **Sent**: Blue
- 🟣 **Partially Received**: Purple
- 🟢 **Fully Received**: Green

---

## Validation Rules

### Creating GRN
1. Must select a PO with status "Sent" or "Partially Received"
2. Cannot receive more than remaining quantity for each item
3. Must receive at least 1 item with quantity > 0
4. Received date cannot be in the future

### Cumulative Quantity Tracking
- System tracks total received across all GRNs for each PO
- Validates new receipts against remaining quantities
- Prevents over-receiving items

---

## Business Logic Improvements

### Before (Old Logic - Incorrect)
- ❌ "Partially Received" GRNs had approve button
- ❌ Could approve incomplete receipts
- ❌ Could edit "Fully Received" POs
- ❌ Status determination was per-GRN, not cumulative

### After (New Logic - Correct)
- ✅ Only "Fully Received" GRNs can be approved
- ✅ Approval only when ALL items are received
- ✅ "Fully Received" POs are view-only
- ✅ Cumulative quantity tracking across all GRNs
- ✅ Proper status transitions matching real-life workflow

---

## Implementation Summary

### Files Modified
1. **grnHelpers.js** - Updated `determineGRNStatus()` with cumulative logic
2. **GRNList.jsx** - Approve button only for "Fully Received" status
3. **POList.jsx** - Disabled Edit/Delete for received POs
4. **poHelpers.js** - Added "Fully Received" and "Partially Received" colors
5. **GRNManage.jsx** - Filters POs properly for GRN creation

### Backend Changes (Already Implemented)
- ✅ Cumulative quantity tracking endpoint
- ✅ Validation to prevent over-receiving
- ✅ Automatic PO status updates
- ✅ Inventory management with proper reversal on delete

---

## Testing Checklist

- [ ] Create PO and send it
- [ ] Receive partial quantities in GRN #1 → Should show "Partially Received", no approve button
- [ ] Receive remaining quantities in GRN #2 → Should show "Fully Received", approve button appears
- [ ] Approve GRN #2 → Status becomes "Approved", all actions locked
- [ ] Verify PO status updates correctly at each step
- [ ] Try to edit "Fully Received" PO → Should be disabled
- [ ] Try to delete "Approved" GRN → Should be disabled
- [ ] Delete unapproved GRN → Should revert inventory and recalculate PO status

---

**Last Updated:** October 6, 2025  
**Version:** 2.0 (Real-Life Workflow Implementation)

