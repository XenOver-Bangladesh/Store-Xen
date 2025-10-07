# 🔧 Codebase Refactoring Guide

## 📋 Overview
This document outlines the new code organization structure and best practices for the POS Store Management system.

---

## 🎯 Refactoring Goals

1. **Separation of Concerns** - Split large files into focused, single-responsibility components
2. **Reusability** - Create shared components and utilities used across the application
3. **Maintainability** - Make code easier to understand, test, and modify
4. **Consistency** - Establish standard patterns across all pages
5. **Performance** - Optimize with custom hooks and efficient data management

---

## 📁 New Project Structure

```
src/
├── Shared/                    # Reusable UI Components
│   ├── PageHeader/           # Page header with title, actions
│   ├── StatsCard/            # Statistics display cards
│   ├── InfoCard/             # Info/alert/warning cards
│   ├── EmptyState/           # Empty state component
│   ├── SharedModal/          # Modal component (existing)
│   ├── SharedTable/          # Table component (existing)
│   ├── ReuseableFilter/      # Filter component (existing)
│   └── InputFrom/            # Form input component (existing)
│
├── utils/                     # Utility Functions
│   ├── api.js                # Centralized API calls
│   ├── notifications.js      # Notification/alert utilities
│   ├── export.js             # Export (CSV, JSON) utilities
│   └── ...
│
├── hooks/                     # Custom React Hooks
│   ├── useApi.js             # API call hook with loading/error
│   ├── useFilters.js         # Filter management hook
│   └── ...
│
└── Pages/                     # Page Modules
    ├── WarehouseList/
    │   ├── WarehouseListRefactored.jsx      # Main page component
    │   ├── components/                       # Page-specific components
    │   │   ├── WarehouseForm.jsx            # Form component
    │   │   └── WarehouseViewModal.jsx       # View modal
    │   ├── hooks/                            # Page-specific hooks
    │   │   └── useWarehouseData.js          # Data management
    │   └── utils/                            # Page-specific utilities
    │       └── warehouseHelpers.js          # Helper functions
    │
    └── [OtherPages]/
        └── [Same structure as above]
```

---

## 🆕 New Shared Components

### 1. PageHeader
**Purpose:** Consistent page headers with title, subtitle, icon, and actions

```jsx
import PageHeader from '../../Shared/PageHeader/PageHeader'

<PageHeader
  title="Warehouse Management"
  subtitle="Manage your warehouse locations"
  icon={Warehouse}
  actions={[
    {
      label: 'Add Warehouse',
      icon: Plus,
      onClick: handleAdd,
      variant: 'primary'
    }
  ]}
/>
```

### 2. StatsCard
**Purpose:** Display statistics in a consistent card format

```jsx
import StatsCard from '../../Shared/StatsCard/StatsCard'

<StatsCard
  label="Total Warehouses"
  value={warehouses.length}
  icon={Warehouse}
  color="blue"
/>
```

### 3. InfoCard
**Purpose:** Show info, warning, success, or error messages

```jsx
import InfoCard from '../../Shared/InfoCard/InfoCard'

<InfoCard
  type="info"  // 'info', 'warning', 'success', 'error'
  title="Important Notice"
  message="This is an important message"
  icon={AlertCircle}
/>
```

### 4. EmptyState
**Purpose:** Display empty states with optional action

```jsx
import EmptyState from '../../Shared/EmptyState/EmptyState'

<EmptyState
  icon={Warehouse}
  title="No warehouses found"
  message="Get started by adding your first warehouse"
  action={{
    label: 'Add Warehouse',
    icon: Plus,
    onClick: handleAdd
  }}
/>
```

---

## 🔧 New Utility Modules

### 1. API Service (`utils/api.js`)
**Purpose:** Centralized API calls with consistent error handling

```jsx
import { api } from '../../utils/api'

// Example usage
const result = await api.warehouses.getAll()
if (result.success) {
  setWarehouses(result.data)
} else {
  console.error(result.error)
}

// Available methods:
api.warehouses.getAll()
api.warehouses.create(data)
api.warehouses.update(id, data)
api.warehouses.delete(id)
// ... and more for other resources
```

### 2. Notifications (`utils/notifications.js`)
**Purpose:** Consistent notification/alert handling

```jsx
import { notify } from '../../utils/notifications'

// Success notification
notify.success('Success', 'Warehouse created successfully')

// Error notification
notify.error('Error', 'Failed to create warehouse')

// Warning
notify.warning('Warning', 'Please fill required fields')

// Confirmation
const confirmed = await notify.confirm('Are you sure?', 'This cannot be undone')

// Delete confirmation
const confirmed = await notify.confirmDelete('Warehouse Name')
```

### 3. Export Utilities (`utils/export.js`)
**Purpose:** Export data to CSV or JSON

```jsx
import { exportToCSV } from '../../utils/export'

const headers = ['Name', 'Location', 'Phone']
const keys = ['name', 'location', 'phone']
exportToCSV(data, headers, keys, 'warehouses.csv')
```

---

## 🪝 Custom Hooks

### 1. useFilters
**Purpose:** Manage filter state and filtered data

```jsx
import { useFilters } from '../../hooks/useFilters'

const {
  filters,
  filteredData,
  handleFilterChange,
  clearFilters
} = useFilters(data, filterFunction, { search: '', status: '' })
```

### 2. useApi
**Purpose:** API calls with loading and error states

```jsx
import { useApi } from '../../hooks/useApi'

const { data, loading, error, execute } = useApi(api.warehouses.getAll)

// Call the API
await execute()
```

---

## 📐 Page Organization Pattern

Each page module should follow this structure:

```
PageName/
├── PageNameRefactored.jsx           # Main component
├── components/                       # UI components specific to this page
│   ├── PageForm.jsx
│   ├── PageViewModal.jsx
│   └── PageCard.jsx
├── hooks/                            # Custom hooks for this page
│   └── usePageData.js
└── utils/                            # Helper functions for this page
    └── pageHelpers.js
```

### Example: Main Page Component

```jsx
import React, { useState } from 'react'
import PageHeader from '../../Shared/PageHeader/PageHeader'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { usePageData } from './hooks/usePageData'
import { useFilters } from '../../hooks/useFilters'
import { filterData } from './utils/pageHelpers'

const PageRefactored = () => {
  // Data management
  const { data, loading, create, update, delete: deleteItem } = usePageData()

  // Filtering
  const { filters, filteredData, handleFilterChange, clearFilters } = 
    useFilters(data, filterData, { search: '' })

  // Render...
  return (
    <div className="space-y-6">
      <PageHeader title="Page Title" icon={Icon} actions={[...]} />
      {/* Stats, filters, table, modals */}
    </div>
  )
}

export default PageRefactored
```

### Example: Data Hook

```jsx
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
    if (result.success) {
      setData(result.data)
    } else {
      notify.error('Error', 'Failed to fetch data')
    }
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

  // ... update, delete methods

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, create, update, delete: deleteItem }
}
```

### Example: Helper Functions

```jsx
// utils/pageHelpers.js

// Filter function
export const filterData = (data, filters) => {
  let filtered = [...data]

  if (filters.search) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  return filtered
}

// Validation function
export const validateForm = (formData) => {
  const errors = []
  
  if (!formData.name) {
    errors.push('Name is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Export configuration
export const getExportConfig = () => ({
  headers: ['Name', 'Status', 'Date'],
  keys: ['name', 'status', 'date'],
  filename: `export_${new Date().toISOString().split('T')[0]}.csv`
})
```

---

## ✅ Refactoring Checklist

When refactoring a page, follow these steps:

### 1. **Analyze Current Code**
- [ ] Identify all functionality in the current file
- [ ] List all state variables
- [ ] List all API calls
- [ ] List all helper functions
- [ ] List all sub-components

### 2. **Create Folder Structure**
- [ ] Create page folder with `components/`, `hooks/`, `utils/` subdirectories
- [ ] Create placeholder files

### 3. **Extract Utilities**
- [ ] Move helper functions to `utils/pageHelpers.js`
- [ ] Move validation logic to utilities
- [ ] Move export configurations

### 4. **Create Custom Hooks**
- [ ] Create data management hook (`usePageData.js`)
- [ ] Move API calls to hook
- [ ] Move data state management to hook

### 5. **Extract Components**
- [ ] Move form to separate component
- [ ] Move modals to separate components
- [ ] Extract any other reusable UI pieces

### 6. **Refactor Main Component**
- [ ] Import all new modules
- [ ] Use custom hooks
- [ ] Use shared components (PageHeader, StatsCard, etc.)
- [ ] Clean up unused code
- [ ] Add proper comments

### 7. **Test**
- [ ] Test all CRUD operations
- [ ] Test filters
- [ ] Test modals
- [ ] Test export functionality
- [ ] Check for console errors

### 8. **Replace Old File**
- [ ] Rename old file to `PageName.jsx.backup`
- [ ] Rename `PageNameRefactored.jsx` to `PageName.jsx`
- [ ] Update imports in routing

---

## 🎨 Code Style Guidelines

### Component Structure
```jsx
// 1. Imports
import React, { useState } from 'react'
import { Icon } from 'lucide-react'
import SharedComponent from '../../Shared/Component'

// 2. Constants
const CONSTANT_VALUE = 'value'

// 3. Component
const ComponentName = ({ prop1, prop2 }) => {
  // 3a. Hooks
  const [state, setState] = useState()
  const { data } = useCustomHook()

  // 3b. Handlers
  const handleClick = () => {}

  // 3c. Derived data
  const derivedValue = useMemo(() => calculate(data), [data])

  // 3d. Render helpers
  const renderItem = (item) => <div>{item.name}</div>

  // 3e. Return
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}

// 4. Export
export default ComponentName
```

### Naming Conventions
- **Components:** PascalCase (`WarehouseForm.jsx`)
- **Hooks:** camelCase with `use` prefix (`useWarehouseData.js`)
- **Utilities:** camelCase (`warehouseHelpers.js`)
- **Constants:** UPPER_SNAKE_CASE (`API_URL`)

---

## 📊 Progress Tracker

### Completed ✅
- [x] Created shared components (PageHeader, StatsCard, InfoCard, EmptyState)
- [x] Created utility modules (api, notifications, export)
- [x] Created custom hooks (useFilters, useApi)
- [x] Refactored WarehouseList page (example)

### In Progress 🔄
- [ ] Refactor remaining Warehouse pages (Transfer, Batch, Barcode)
- [ ] Refactor GRN pages
- [ ] Refactor PO pages
- [ ] Refactor Product pages
- [ ] Refactor Supplier pages
- [ ] Refactor Payment pages

### Pending ⏳
- [ ] Create comprehensive tests
- [ ] Update documentation
- [ ] Performance optimization
- [ ] Code review and cleanup

---

## 📝 Example Migration

### Before (Old Structure)
```jsx
// 584 lines in one file
const WarehouseList = () => {
  // 50+ lines of state
  // 100+ lines of handlers
  // 200+ lines of JSX
  // 100+ lines of inline functions
  // Everything mixed together
}
```

### After (New Structure)
```
WarehouseList/
├── WarehouseListRefactored.jsx      # 200 lines - Clean, focused
├── components/
│   ├── WarehouseForm.jsx            # 150 lines - Form logic
│   └── WarehouseViewModal.jsx       # 80 lines - View logic
├── hooks/
│   └── useWarehouseData.js          # 80 lines - Data management
└── utils/
    └── warehouseHelpers.js          # 80 lines - Helper functions
```

**Benefits:**
- ✅ Each file has single responsibility
- ✅ Easy to find and modify specific functionality
- ✅ Components are reusable
- ✅ Easier to test
- ✅ Better code organization

---

## 🚀 Getting Started

1. **Review this guide**
2. **Examine the refactored WarehouseList as a reference**
3. **Follow the refactoring checklist** for each page
4. **Test thoroughly** after each refactoring
5. **Update imports** in routing files

---

## 💡 Tips

- Start with smaller pages first to get comfortable with the pattern
- Keep the old file as `.backup` until the new version is tested
- Use TypeScript for better type safety (future enhancement)
- Add PropTypes or TypeScript for prop validation
- Write unit tests for utility functions
- Document any complex logic with comments

---

**Last Updated:** 2025-01-07  
**Version:** 1.0  
**Status:** Initial Refactoring Complete

