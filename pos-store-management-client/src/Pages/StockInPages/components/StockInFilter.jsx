import React from 'react'
import { ReuseableFilter } from '../../../Shared/ReuseableFilter/ReuseableFilter'
import { exportStockInToCSV, downloadCSV } from '../utils/stockInHelpers'

const StockInFilter = ({ 
  filters, 
  onFilterChange, 
  suppliers = [],
  stockInItems = [],
  filteredStockInItems = [],
  resultsCount = 0,
  totalCount = 0
}) => {
  const filterConfig = [
    {
      type: 'search',
      key: 'search',
      label: 'Search GRN/PO',
      placeholder: 'Search by GRN or PO Number...'
    },
    {
      type: 'select',
      key: 'status',
      label: 'Status',
      placeholder: 'All Statuses',
      options: [
        { value: '', label: 'All Status' },
        { value: 'Approved', label: '✅ Approved' },
        { value: 'Fully Received', label: '🟢 Fully Received' },
        { value: 'Partially Received', label: '🟡 Partially Received' }
      ]
    },
    {
      type: 'select',
      key: 'supplier',
      label: 'Supplier',
      placeholder: 'All Suppliers',
      options: [
        { value: '', label: 'All Suppliers' },
        ...suppliers.map(supplier => ({
          value: supplier._id,
          label: supplier.supplierName
        }))
      ]
    },
    {
      type: 'date',
      key: 'dateFrom',
      label: 'Date From',
      placeholder: 'Start Date'
    },
    {
      type: 'date',
      key: 'dateTo',
      label: 'Date To',
      placeholder: 'End Date'
    }
  ]

  const handleClearFilters = () => {
    onFilterChange({
      status: '',
      supplier: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    })
  }

  const handleExport = () => {
    const csv = exportStockInToCSV(filteredStockInItems, suppliers)
    downloadCSV(csv, `stock-in-${Date.now()}.csv`)
  }

  const handleFilterChangeInternal = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <ReuseableFilter
      filters={filters}
      onFilterChange={handleFilterChangeInternal}
      onClearFilters={handleClearFilters}
      onExport={handleExport}
      filterConfig={filterConfig}
      title="Filter Stock In History"
      showExport={true}
      showClear={true}
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  )
}

export default StockInFilter

