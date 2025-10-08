import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import Button from '../../../Components/UI/Button'

const DiscountFilter = ({ filters, onFilterChange, onClearFilters, discounts, filteredDiscounts }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Filters</span>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-blue-600">{filteredDiscounts.length}</span> of{' '}
          <span className="font-semibold">{discounts.length}</span> discounts
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search offers..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Percentage">Percentage</option>
          <option value="Flat">Flat</option>
          <option value="BOGO">Buy 1 Get 1</option>
        </select>

        <Button
          variant="secondary"
          size="md"
          onClick={onClearFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-1" />
          Clear Filters
        </Button>
      </div>
    </div>
  )
}

export default DiscountFilter

