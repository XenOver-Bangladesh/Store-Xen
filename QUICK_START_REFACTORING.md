# ⚡ Quick Start: Refactoring Your Pages

## 🎯 5-Minute Guide to Refactor Any Page

Follow these steps to refactor any page in your application using the new structure.

---

## 📋 Step-by-Step Process

### Step 1: Create Folder Structure (2 minutes)

```bash
# Example: Refactoring StockTransfer page
Pages/
└── StockTransferPages/
    ├── components/
    ├── hooks/
    └── utils/
```

Create these three subdirectories in your page folder.

---

### Step 2: Extract Helper Functions (5 minutes)

**Create:** `utils/stockTransferHelpers.js`

```javascript
// Move all helper functions here
export const filterTransfers = (transfers, filters) => {
  // Filter logic
}

export const validateTransferForm = (formData) => {
  // Validation logic
}

export const getExportConfig = () => ({
  headers: ['Product', 'From', 'To', 'Quantity', 'Date'],
  keys: ['productName', 'sourceWarehouse', 'destinationWarehouse', 'quantity', 'createdAt'],
  filename: `stock-transfers_${new Date().toISOString().split('T')[0]}.csv`
})
```

---

### Step 3: Create Data Hook (10 minutes)

**Create:** `hooks/useStockTransferData.js`

```javascript
import { useState, useEffect } from 'react'
import { api } from '../../../utils/api'
import { notify } from '../../../utils/notifications'

export const useStockTransferData = () => {
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTransfers = async () => {
    setLoading(true)
    const result = await api.stockTransfers.getAll()
    if (result.success) {
      setTransfers(result.data)
    } else {
      notify.error('Error', 'Failed to fetch transfers')
    }
    setLoading(false)
  }

  const createTransfer = async (transferData) => {
    const result = await api.stockTransfers.create(transferData)
    if (result.success) {
      notify.success('Success', 'Transfer created successfully')
      await fetchTransfers()
      return true
    }
    notify.error('Error', result.error)
    return false
  }

  useEffect(() => {
    fetchTransfers()
  }, [])

  return { transfers, loading, createTransfer, fetchTransfers }
}
```

---

### Step 4: Extract Form Component (15 minutes)

**Create:** `components/StockTransferForm.jsx`

```javascript
import React from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import Button from '../../../Components/UI/Button'
import { validateTransferForm } from '../utils/stockTransferHelpers'
import { notify } from '../../../utils/notifications'

const StockTransferForm = ({ isOpen, onClose, formData, setFormData, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const validation = validateTransferForm(formData)
    if (!validation.isValid) {
      notify.warning('Validation Error', validation.errors.join(', '))
      return
    }
    onSubmit(formData)
  }

  return (
    <SharedModal isOpen={isOpen} onClose={onClose} title="Transfer Stock">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Transfer
          </Button>
        </div>
      </form>
    </SharedModal>
  )
}

export default StockTransferForm
```

---

### Step 5: Refactor Main Component (20 minutes)

**Create:** `StockTransferRefactored.jsx`

```javascript
import React, { useState } from 'react'
import { ArrowRightLeft, Plus } from 'lucide-react'
import PageHeader from '../../Shared/PageHeader/PageHeader'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import EmptyState from '../../Shared/EmptyState/EmptyState'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { ReuseableFilter } from '../../Shared/ReuseableFilter/ReuseableFilter'
import StockTransferForm from './components/StockTransferForm'
import { useStockTransferData } from './hooks/useStockTransferData'
import { useFilters } from '../../hooks/useFilters'
import { filterTransfers, getExportConfig } from './utils/stockTransferHelpers'
import { exportToCSV } from '../../utils/export'

const StockTransferRefactored = () => {
  // Data management
  const { transfers, loading, createTransfer } = useStockTransferData()

  // Filtering
  const { filters, filteredData, handleFilterChange, clearFilters } = 
    useFilters(transfers, filterTransfers, { search: '', warehouse: '' })

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({})

  // Handlers
  const handleAdd = () => setModalOpen(true)
  
  const handleSubmit = async (data) => {
    const success = await createTransfer(data)
    if (success) setModalOpen(false)
  }

  const handleExport = () => {
    const { headers, keys, filename } = getExportConfig()
    exportToCSV(filteredData, headers, keys, filename)
  }

  // ... rest of component

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Transfer"
        subtitle="Transfer inventory between warehouses"
        icon={ArrowRightLeft}
        actions={[{ label: 'New Transfer', icon: Plus, onClick: handleAdd }]}
      />
      
      <div className="grid grid-cols-3 gap-4">
        <StatsCard label="Total Transfers" value={transfers.length} color="blue" />
      </div>

      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filterConfig={filterConfig}
        onExport={handleExport}
      />

      {filteredData.length === 0 ? (
        <EmptyState
          icon={ArrowRightLeft}
          title="No transfers found"
          message="Start by creating your first stock transfer"
          action={{ label: 'New Transfer', onClick: handleAdd }}
        />
      ) : (
        <SharedTable
          columns={columns}
          data={filteredData}
          loading={loading}
          renderRowActions={renderRowActions}
        />
      )}

      <StockTransferForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default StockTransferRefactored
```

---

## ✅ Checklist for Each Page

- [ ] Create folder structure (components/, hooks/, utils/)
- [ ] Extract helper functions to utils/
- [ ] Create data management hook in hooks/
- [ ] Extract form component
- [ ] Extract view/details modal
- [ ] Refactor main component with shared components
- [ ] Test all functionality
- [ ] Replace old file

---

## 🎨 Templates

### Helper Functions Template

```javascript
// utils/pageHelpers.js

export const filterData = (data, filters) => {
  // Filter logic
}

export const validateForm = (formData) => {
  const errors = []
  // Validation logic
  return { isValid: errors.length === 0, errors }
}

export const getExportConfig = () => ({
  headers: ['Column 1', 'Column 2'],
  keys: ['key1', 'key2'],
  filename: `export_${Date.now()}.csv`
})
```

### Data Hook Template

```javascript
// hooks/usePageData.js

import { useState, useEffect } from 'react'
import { api } from '../../../utils/api'
import { notify } from '../../../utils/notifications'

export const usePageData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const result = await api.resource.getAll()
    if (result.success) setData(result.data)
    else notify.error('Error', 'Failed to fetch data')
    setLoading(false)
  }

  const create = async (itemData) => {
    const result = await api.resource.create(itemData)
    if (result.success) {
      notify.success('Success', 'Created successfully')
      await fetchData()
      return true
    }
    return false
  }

  const update = async (id, itemData) => {
    const result = await api.resource.update(id, itemData)
    if (result.success) {
      notify.success('Success', 'Updated successfully')
      await fetchData()
      return true
    }
    return false
  }

  const deleteItem = async (id, name) => {
    const confirmed = await notify.confirmDelete(name)
    if (!confirmed) return false
    
    const result = await api.resource.delete(id)
    if (result.success) {
      notify.success('Success', 'Deleted successfully')
      await fetchData()
      return true
    }
    return false
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, create, update, delete: deleteItem }
}
```

---

## 🚀 Time Estimates

| Task | Time |
|------|------|
| Create folder structure | 2 min |
| Extract helper functions | 5 min |
| Create data hook | 10 min |
| Extract form component | 15 min |
| Extract view modal | 10 min |
| Refactor main component | 20 min |
| Testing | 10 min |
| **Total per page** | **~1 hour** |

---

## 💡 Pro Tips

1. **Start small** - Refactor simple pages first
2. **Copy patterns** - Use WarehouseList as reference
3. **Test frequently** - Test after each extraction
4. **Keep backups** - Rename old files to `.backup`
5. **One at a time** - Don't refactor multiple pages simultaneously

---

## 🎯 Priority Order

Suggested order for refactoring:

1. ✅ WarehouseList (Done - use as reference)
2. ⏭️ Stock Transfer (Similar structure)
3. ⏭️ Batch Tracking (Similar structure)
4. ⏭️ Barcode Management (Similar structure)
5. ⏭️ Supplier Pages (Medium complexity)
6. ⏭️ Product Pages (Medium complexity)
7. ⏭️ Payment Pages (Medium complexity)
8. ⏭️ GRN Pages (More complex)
9. ⏭️ PO Pages (More complex)

---

## ❓ FAQs

**Q: What if I break something?**  
A: Keep the old file as `.backup` until you're confident the new version works.

**Q: Do I need to refactor everything at once?**  
A: No! Refactor one page at a time, test it, then move to the next.

**Q: Can I modify the structure?**  
A: Yes! Adjust it to your needs, but keep the core separation of concerns.

**Q: What if my page is different?**  
A: Follow the same principles: extract helpers, create hooks, separate components.

---

**Happy Refactoring! 🎉**

