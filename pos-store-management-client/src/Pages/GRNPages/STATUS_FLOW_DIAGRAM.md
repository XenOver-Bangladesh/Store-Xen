# GRN & PO Status Flow - Visual Diagram

## 🔄 Complete Workflow Visualization

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PURCHASE ORDER LIFECYCLE                         │
└─────────────────────────────────────────────────────────────────────┘

    [Draft/Pending]
         🟡
         │
         │ Send PO to Supplier
         ↓
      [Sent]
         🔵
         │
         │ Create GRN (Receive Some Items)
         ↓
  [Partially Received]
         🟣
         │
         │ Create More GRNs (Receive Remaining Items)
         ↓
   [Fully Received]
         🟢
         │
         │ (PO Complete - View Only)
         ↓
     [LOCKED]


┌─────────────────────────────────────────────────────────────────────┐
│                  GOODS RECEIVE NOTE LIFECYCLE                        │
└─────────────────────────────────────────────────────────────────────┘

    [Pending]
       🟡
       │ (Rare - No items received)
       │
       │ Receive Some Items
       ↓
[Partially Received]    ←──┐
       🔵               │  More GRNs
       │                │  Created
       │                │
       │ Receive ALL    │
       │ Remaining      │
       ↓                │
 [Fully Received]       │
       🟣               │
       │                │
       │ Click APPROVE  │
       ↓                │
    [Approved]          │
       🟢               │
       │                │
       │ (GRN Locked)   │
       ↓                │
     [LOCKED]           │
                        │
    If GRN Deleted ─────┘
    (Before Approval)
```

## 📊 Action Matrix Visualization

```
┌──────────────────────────────────────────────────────────────────────┐
│                         GRN ACTIONS                                   │
├──────────────────┬──────┬──────┬─────────┬────────┬─────────────────┤
│ Status           │ View │ Edit │ Approve │ Delete │ Notes           │
├──────────────────┼──────┼──────┼─────────┼────────┼─────────────────┤
│ Pending          │  ✅  │  ✅  │   ❌    │   ✅   │ Rare status     │
│ Partially Recv'd │  ✅  │  ✅  │   ❌    │   ✅   │ Work in progress│
│ Fully Received   │  ✅  │  ❌  │   ✅    │   ✅   │ Ready to approve│
│ Approved         │  ✅  │  ❌  │   ❌    │   ❌   │ Locked forever  │
└──────────────────┴──────┴──────┴─────────┴────────┴─────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                      PURCHASE ORDER ACTIONS                           │
├──────────────────┬──────┬──────┬──────┬────────┬────────────────────┤
│ Status           │ View │ Edit │ Send │ Delete │ Create GRN         │
├──────────────────┼──────┼──────┼──────┼────────┼────────────────────┤
│ Draft/Pending    │  ✅  │  ✅  │  ✅  │   ✅   │       ❌           │
│ Sent             │  ✅  │  ❌  │  ❌  │   ❌   │       ✅           │
│ Partially Recv'd │  ✅  │  ❌  │  ❌  │   ❌   │       ✅           │
│ Fully Received   │  ✅  │  ❌  │  ❌  │   ❌   │       ❌           │
└──────────────────┴──────┴──────┴──────┴────────┴────────────────────┘
```

## 🎨 Status Badge Colors

```
┌─────────────────────────────────────────┐
│         GRN STATUS COLORS               │
├─────────────────────────────────────────┤
│  🟡 Pending          (Yellow)           │
│  🔵 Partially Recv'd (Blue)             │
│  🟣 Fully Received   (Purple) ← APPROVE │
│  🟢 Approved         (Green)            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          PO STATUS COLORS               │
├─────────────────────────────────────────┤
│  🟡 Pending          (Yellow)           │
│  🔵 Sent             (Blue)             │
│  🟣 Partially Recv'd (Purple)           │
│  🟢 Fully Received   (Green)            │
└─────────────────────────────────────────┘
```

## 📋 Example Scenario: Multiple Deliveries

```
PURCHASE ORDER: PO-2025-001
Items:
  • Product A: 100 units ordered
  • Product B: 200 units ordered

═══════════════════════════════════════════════════════════════

DAY 1: Create and Send PO
┌────────────────────┐
│  PO-2025-001       │
│  Status: Sent 🔵   │
│  A: 0/100          │
│  B: 0/200          │
└────────────────────┘

═══════════════════════════════════════════════════════════════

DAY 5: First Delivery Arrives (Partial)
┌────────────────────┐         ┌───────────────────────────┐
│  PO-2025-001       │         │  GRN-001                  │
│  Status: Partially │ ◄────── │  Status: Partially 🔵     │
│  Received 🟣       │         │  A: 50/100 received       │
│  A: 50/100         │         │  B: 100/200 received      │
│  B: 100/200        │         │  ❌ No Approve Button     │
└────────────────────┘         └───────────────────────────┘
        │
        │ Can still receive more items
        ↓
    [Create Another GRN]

═══════════════════════════════════════════════════════════════

DAY 10: Second Delivery Arrives (Remaining Items)
┌────────────────────┐         ┌───────────────────────────┐
│  PO-2025-001       │         │  GRN-002                  │
│  Status: Fully     │ ◄────── │  Status: Fully 🟣         │
│  Received 🟢       │         │  A: 50/50 received        │
│  A: 100/100 ✓      │         │  B: 100/100 received      │
│  B: 200/200 ✓      │         │  ✅ APPROVE BUTTON SHOWS! │
└────────────────────┘         └───────────────────────────┘
        │                               │
        │                               │ Click Approve
        │                               ↓
        │                      ┌───────────────────────────┐
        │                      │  GRN-002                  │
        │                      │  Status: Approved 🟢      │
        │                      │  🔒 Locked - View Only    │
        │                      └───────────────────────────┘
        │
        ↓
   [PO COMPLETE]
   View Only - Cannot Edit/Delete
```

## 🔍 Decision Tree: "Can I Approve This GRN?"

```
                    START
                      │
                      ↓
        ┌─────────────────────────────┐
        │ Check GRN Status Badge      │
        └─────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    🟡 Yellow?               🔵 Blue?
         │                         │
         ↓                         ↓
      [Pending]            [Partially Received]
         │                         │
         ↓                         ↓
        ❌ NO                     ❌ NO
   Not yet received      Still receiving items
         │                         │
         └──────────┬──────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    🟣 Purple?           🟢 Green?
         │                     │
         ↓                     ↓
  [Fully Received]        [Approved]
         │                     │
         ↓                     ↓
    ✅ YES!!!              ❌ NO
  APPROVE BUTTON         Already approved
      SHOWS!
```

## 💡 Key Rules in Simple Terms

```
╔═══════════════════════════════════════════════════════════╗
║                  THE GOLDEN RULE                          ║
║                                                           ║
║   Purple Badge (🟣) = Ready to Approve                   ║
║   Blue Badge (🔵) = Not Ready Yet                        ║
║                                                           ║
║   APPROVE ONLY WHEN ALL ITEMS ARE FULLY RECEIVED!        ║
╚═══════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────┐
│  Rule #1: One Delivery = One GRN                          │
│  • First truck arrives? Create GRN #1                     │
│  • Second truck arrives? Create GRN #2                    │
│  • Each delivery gets its own GRN                         │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  Rule #2: Last GRN Gets Approved                          │
│  • GRN #1: Partial → No approve (more coming)            │
│  • GRN #2: Partial → No approve (still more)             │
│  • GRN #3: Fully Received → APPROVE THIS ONE!            │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  Rule #3: Fully Received = View Only                      │
│  • PO fully received? View only (done!)                   │
│  • GRN approved? View only (locked!)                      │
│  • Protects your data integrity                           │
└───────────────────────────────────────────────────────────┘
```

## 🎯 Quick Visual Checklist

```
Before Clicking Approve:
┌─────────────────────────────────────────┐
│ ☐ Is GRN badge PURPLE? (🟣)            │
│ ☐ Are ALL items fully received?        │
│ ☐ Is "Approve" button visible?         │
│ ☐ Are quantities correct?              │
│ ☐ Ready to lock this GRN?              │
└─────────────────────────────────────────┘
      ↓ If ALL checked
      ↓
    [APPROVE]
      ↓
  ✅ Success!
  GRN now locked (Green 🟢)
```

## 🚦 Traffic Light System

```
    🟡 YELLOW
    Pending/Draft
    "Nothing started yet"
         │
         ↓
    🔵 BLUE
    Sent/In Progress
    "Work in progress"
         │
         ↓
    🟣 PURPLE
    Fully Received
    "⚠️ ACTION NEEDED - APPROVE!"
         │
         ↓
    🟢 GREEN
    Approved/Complete
    "✓ All done!"
```

---

## 📚 Related Documentation

- **WORKFLOW_LOGIC.md** - Detailed business logic
- **QUICK_REFERENCE.md** - Quick lookup guide
- **GRN_DOCUMENTATION.md** - Technical documentation
- **GRN_LOGIC_IMPROVEMENTS.md** - What was fixed

---

**Remember:** Purple badge = Approve button appears! 🟣✨

