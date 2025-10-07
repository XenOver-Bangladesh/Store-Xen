import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import Button from '../../../Components/UI/Button'

const InventoryFilter = ({ 
  filters, 
  onFilterChange, 
  categories = [],
  resultsCount = 0,
  totalCount = 0
}) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value })
  }

  const handleReset = () => {
    onFilterChange({
      search: '',
      category: '',
      stockStatus: '',
      expiryStatus: '',
      location: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Product name..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Status
          </label>
          <select
            value={filters.stockStatus}
            onChange={(e) => handleChange('stockStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Stock Levels</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Expiry Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Status
          </label>
          <select
            value={filters.expiryStatus}
            onChange={(e) => handleChange('expiryStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="expired">Expired</option>
            <option value="expiring-soon">Expiring Soon</option>
            <option value="valid">Valid</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="Warehouse location..."
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{resultsCount}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalCount}</span> products
        </p>
      </div>
    </div>
  )
}

export default InventoryFilter

