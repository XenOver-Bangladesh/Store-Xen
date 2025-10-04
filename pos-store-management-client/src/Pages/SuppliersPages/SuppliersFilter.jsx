import React from 'react'
import { ReuseableFilter } from '../../Shared/ReuseableFilter/ReuseableFilter'

export const SuppliersFilter = ({
  filters = {},
  onFilterChange = () => {},
  onClearFilters = () => {},
  onExport = () => {},
  resultsCount = 0,
  totalCount = 0
}) => {
  const filterConfig = [
    {
      key: 'search',
      label: 'Search Suppliers',
      type: 'search',
      placeholder: 'Search by name, contact, email, or phone...',
      span: 2
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      type: 'select',
      options: [
        { value: '', label: 'All Payment Terms' },
        { value: 'Cash', label: 'Cash' },
        { value: '7 Days Credit', label: '7 Days Credit' },
        { value: '15 Days Credit', label: '15 Days Credit' },
        { value: '30 Days Credit', label: '30 Days Credit' }
      ]
    }
  ]

  return (
    <ReuseableFilter
      filters={filters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      onExport={onExport}
      filterConfig={filterConfig}
      title="Suppliers Filters & Search"
      resultsCount={resultsCount}
      totalCount={totalCount}
      showExport={true}
      showClear={true}
    />
  )
}
