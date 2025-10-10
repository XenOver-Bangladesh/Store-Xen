# Inventory Pages Reorganization Guide

## 📋 Overview
This guide outlines the reorganization of all inventory pages to follow the same structured pattern as `InStockProductPages`.

## 🎯 Target Structure (Per Page)
```
PageName/
├── components/
│   ├── PageList.jsx        # Table/List component
│   ├── PageFilter.jsx      # Filter component (if needed)
│   └── PageModal.jsx       # Modal components (if needed)
├── services/
│   └── pageService.js      # API calls
├── utils/
│   └── pageHelpers.js      # Helper functions, calculations, formatters
└── PageName.jsx            # Main page component
```

## 📁 Pages to Reorganize

### 1. ✅ LowStockAlerts (IN PROGRESS)
**Current Status:** utils/ created
**Files to Create:**
- ✅ `utils/lowStockHelpers.js` - DONE
- ⏳ `components/LowStockList.jsx` - Table component
- ⏳ `components/LowStockFilter.jsx` - Filter component  
- ⏳ `components/ReorderModal.jsx` - Bulk reorder modal
- ⏳ `services/lowStockService.js` - API calls
- ⏳ `LowStockAlerts.jsx` - Refactored main component

### 2. ⏳ StockDashboard
**Files to Create:**
- `components/StockList.jsx`
- `components/StockFilter.jsx`
- `services/stockDashboardService.js`
- `utils/stockDashboardHelpers.js`
- `StockDashboard.jsx` - Refactored

### 3. ⏳ InventoryValuation
**Files to Create:**
- `components/ValuationList.jsx`
- `components/ValuationFilter.jsx`
- `components/ValuationChart.jsx` (if has charts)
- `services/valuationService.js`
- `utils/valuationHelpers.js`
- `InventoryValuation.jsx` - Refactored

### 4. ⏳ SalesReports
**Files to Create:**
- `components/SalesReportList.jsx`
- `components/SalesReportFilter.jsx`
- `components/SalesReportChart.jsx`
- `services/salesReportService.js`
- `utils/salesReportHelpers.js`
- `SalesReports.jsx` - Refactored

### 5. ⏳ ProfitLossReports
**Files to Create:**
- `components/ProfitLossList.jsx`
- `components/ProfitLossFilter.jsx`
- `components/ProfitLossChart.jsx`
- `services/profitLossService.js`
- `utils/profitLossHelpers.js`
- `ProfitLossReports.jsx` - Refactored

### 6. ⏳ StockAnalysis
**Files to Create:**
- `components/AnalysisList.jsx`
- `components/AnalysisFilter.jsx`
- `components/AnalysisChart.jsx`
- `services/stockAnalysisService.js`
- `utils/stockAnalysisHelpers.js`
- `StockAnalysis.jsx` - Refactored

### 7. ⏳ AutoReorderSuggestions
**Files to Create:**
- `components/SuggestionsList.jsx`
- `components/SuggestionsFilter.jsx`
- `components/ReorderModal.jsx`
- `services/reorderService.js`
- `utils/reorderHelpers.js`
- `AutoReorderSuggestions.jsx` - Refactored

## 📝 Component Responsibilities

### Main Page Component (`PageName.jsx`)
- **State Management**: Manage all page state
- **Data Fetching**: Coordinate API calls
- **Event Handlers**: Handle user actions
- **Layout**: Compose child components
- **Props Passing**: Pass data to children

### List Component (`components/PageList.jsx`)
- **Display Data**: Render table/list using SharedTable
- **Column Definition**: Define table columns
- **Row Actions**: Handle row-level actions
- **Props**: Receive data, columns, loading state

### Filter Component (`components/PageFilter.jsx`)
- **Filter UI**: Render filter inputs using ReuseableFilter
- **Filter Config**: Define filter configuration
- **Props**: Receive filters, onChange handlers

### Service File (`services/pageService.js`)
- **API Calls**: All HTTP requests
- **Data Transformation**: Format API responses
- **Error Handling**: Catch and handle errors
- **Export Functions**: Named exports for each API call

### Utils/Helpers File (`utils/pageHelpers.js`)
- **Calculations**: Business logic calculations
- **Formatters**: Data formatting functions
- **Validators**: Data validation
- **Filters**: Client-side filtering logic
- **Pure Functions**: No side effects

## 🔧 Implementation Pattern

### Example: Low Stock Alerts

#### 1. utils/lowStockHelpers.js
```javascript
// Calculations
export const calculateLowStockStats = (lowStockData, productsData) => {...}
export const calculateSuggestedQuantity = (product) => {...}

// Formatters
export const getSeverityLevel = (item, products) => {...}
export const getSeverityIcon = (item, products) => {...}

// Filters
export const filterLowStockItems = (items, products, filters) => {...}
export const groupItemsBySupplier = (items, products, suppliers) => {...}

// Config
export const createFilterConfig = (products, suppliers) => {...}
```

#### 2. services/lowStockService.js
```javascript
import api from '../../../utils/api'

export const lowStockAPI = {
  getAll: async () => {...},
  getLowStock: async (threshold) => {...},
  createReorder: async (data) => {...}
}
```

#### 3. components/LowStockList.jsx
```javascript
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { getSeverityLevel, getSeverityIcon } from '../utils/lowStockHelpers'

const LowStockList = ({ data, products, loading, onReorder }) => {
  const columns = [...]
  
  return <SharedTable data={data} columns={columns} loading={loading} />
}
```

#### 4. LowStockAlerts.jsx
```javascript
import { useState, useEffect } from 'react'
import LowStockList from './components/LowStockList'
import ReorderModal from './components/ReorderModal'
import { lowStockAPI } from './services/lowStockService'
import { calculateLowStockStats, filterLowStockItems } from './utils/lowStockHelpers'

const LowStockAlerts = () => {
  // State
  // Effects
  // Handlers
  // Render
}
```

## ✅ Benefits of This Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Reusability**: Components and utilities can be reused
3. **Testability**: Pure functions are easy to test
4. **Maintainability**: Easy to find and update code
5. **Scalability**: Easy to add new features
6. **Readability**: Clear code organization
7. **Consistency**: Same pattern across all pages

## 📊 Migration Checklist (Per Page)

### Before Starting
- [ ] Read and understand current page logic
- [ ] Identify state management patterns
- [ ] List all API calls
- [ ] Identify helper functions
- [ ] Map out component hierarchy

### During Migration
- [ ] Create folder structure
- [ ] Extract helper functions to utils/
- [ ] Extract API calls to services/
- [ ] Create List component with table columns
- [ ] Create Filter component (if needed)
- [ ] Create Modal components (if needed)
- [ ] Refactor main component
- [ ] Update imports

### After Migration
- [ ] Test all functionality
- [ ] Check for console errors
- [ ] Verify data fetching
- [ ] Test filters and search
- [ ] Test actions and modals
- [ ] Run linter
- [ ] Update documentation

## 🎯 Priority Order

1. **High Priority** (Most Complex)
   - LowStockAlerts
   - AutoReorderSuggestions
   - StockAnalysis

2. **Medium Priority**
   - SalesReports
   - ProfitLossReports
   - InventoryValuation

3. **Low Priority** (Simpler)
   - StockDashboard

## 📚 Reference Implementation

See `InStockProductPages/` for complete reference implementation:
- Well-organized folder structure
- Clean separation of concerns
- Reusable components
- Helper functions in utils
- API calls in services

## 🚀 Next Steps

1. Complete LowStockAlerts reorganization
2. Use it as template for other pages
3. Apply same pattern consistently
4. Document any page-specific variations
5. Create shared utilities where applicable

---

**Note**: This is a significant refactoring that will improve code quality, maintainability, and consistency across the application. Take time to do it properly for each page.

