# GRN Module - Quick Reference Guide

## ⚠️ MOST IMPORTANT: Inventory Updates Immediately!

### 🎯 **Stock Updates When You CREATE GRN, NOT When You Approve!**

```
✅ Create GRN → Stock Updated RIGHT NOW → Items Available Immediately
❌ NOT: Create GRN → Wait for Approval → Then Stock Updates
```

**Example:**
- Create GRN with 50 units → **Stock increases by 50 instantly** ✅
- You can sell these 50 units **right now** (don't wait for approval!)
- Approval comes later for paperwork/authorization only

---

## 🎯 When Can I Approve a GRN?

### ✅ YES - You Can Approve When:
- GRN status shows **"Fully Received"** (purple badge)
- ALL items from the Purchase Order are completely received
- The **Approve** button is visible
- *Note: Stock is already updated, approval just locks the record*

### ❌ NO - You Cannot Approve When:
- GRN status shows **"Partially Received"** (blue badge)
- Some items are still pending receipt
- The Approve button is NOT visible
- *Note: Partial items are already in stock and usable!*

---

## 📋 Quick Actions Reference

### Purchase Order Actions

| PO Status | View | Edit | Send | Delete | Create GRN |
|-----------|------|------|------|--------|------------|
| **Pending** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Sent** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Partially Received** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Fully Received** | ✅ | ❌ | ❌ | ❌ | ❌ |

### GRN Actions

| GRN Status | View | Edit | Approve | Delete |
|------------|------|------|---------|--------|
| **Pending** | ✅ | ✅ | ❌ | ✅ |
| **Partially Received** | ✅ | ✅ | ❌ | ✅ |
| **Fully Received** | ✅ | ❌ | ✅ | ✅ |
| **Approved** | ✅ | ❌ | ❌ | ❌ |

---

## 🔄 Common Workflows

### Single Delivery (Simple Case)
```
1. Create PO → Send PO
2. Goods arrive → Create GRN (receive all items)
3. GRN Status: "Fully Received" 🟣
4. Click "Approve" button ✅
5. Done! 
```

### Multiple Deliveries (Common Case)
```
1. Create PO → Send PO
2. First delivery → Create GRN #1 (partial items)
   → Status: "Partially Received" 🔵 (No approve button yet)
3. Second delivery → Create GRN #2 (remaining items)
   → Status: "Fully Received" 🟣 (Approve button appears!)
4. Click "Approve" on GRN #2 ✅
5. Done!
```

---

## 🎨 Status Colors

### GRN Statuses
- 🟡 **Yellow** = Pending (no items received yet)
- 🔵 **Blue** = Partially Received (some items received, more to come)
- 🟣 **Purple** = Fully Received (all items received, ready to approve)
- 🟢 **Green** = Approved (finalized and locked)

### PO Statuses
- 🟡 **Yellow** = Pending (draft)
- 🔵 **Blue** = Sent (waiting for delivery)
- 🟣 **Purple** = Partially Received (some items received)
- 🟢 **Green** = Fully Received (all items received)

---

## ⚠️ Common Mistakes to Avoid

### ❌ WRONG
- Trying to approve a "Partially Received" GRN
- Editing a PO after items have been received
- Deleting an approved GRN

### ✅ CORRECT
- Only approve GRNs with "Fully Received" status
- Create new GRNs for additional deliveries instead of editing PO
- Delete GRNs only before approval if needed

---

## 💡 Pro Tips

1. **Check the Status Badge Color**
   - Blue badge = Not ready for approval
   - Purple badge = Ready for approval

2. **Multiple Deliveries?**
   - Create separate GRNs for each delivery
   - System automatically tracks cumulative quantities
   - Last GRN will show "Fully Received" when complete

3. **Made a Mistake?**
   - Can delete unapproved GRNs
   - Inventory automatically reverts
   - PO status recalculates automatically

4. **View-Only Mode**
   - Fully Received POs = View only
   - Approved GRNs = View only
   - This protects data integrity

---

## 🆘 Troubleshooting

### "I can't see the Approve button"
**Reason:** GRN status is "Partially Received"  
**Solution:** Wait for all items to be received, or create another GRN for remaining items

### "I can't edit my PO"
**Reason:** PO status is "Sent" or items already received  
**Solution:** Cannot edit after sending. Create correcting GRNs or contact admin

### "I can't delete this GRN"
**Reason:** GRN is already approved  
**Solution:** Approved records are locked for audit purposes. Contact admin if correction needed

### "Received more than ordered"
**Reason:** System validation prevents over-receiving  
**Solution:** Check cumulative quantities. You may have already received some items in a previous GRN

---

## 📞 Need Help?

- Check the full **WORKFLOW_LOGIC.md** for detailed explanations
- Review **GRN_DOCUMENTATION.md** for technical details
- Contact system administrator for special cases

---

**Remember:** The approve button ONLY appears when ALL items are FULLY received! 🎯

