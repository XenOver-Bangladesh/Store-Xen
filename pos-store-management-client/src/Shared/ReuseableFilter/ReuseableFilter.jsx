import React from 'react'
import Button from '../../Components/UI/Button'
import { Filter, Download, RefreshCw } from 'lucide-react'

export const ReuseableFilter = ({
  filters = {},
  onFilterChange = () => {},
  onClearFilters = () => {},
  onExport = () => {},
  filterConfig = [],
  title = "Filters & Search",
  showExport = true,
  showClear = true,
  resultsCount = 0,
  totalCount = 0
}) => {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5 mt-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {showClear && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearFilters}
            >
              <div className="flex p-1 items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Filters
              </div>
            </Button>
          )}
          {showExport && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExport}
            >
              <div className="flex p-1 items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </div>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filterConfig.map((config, index) => (
          <div key={index} className={config.span ? `lg:col-span-${config.span}` : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.label}
            </label>
            {config.type === 'search' ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={filters[config.key] || ''}
                  onChange={(e) => onFilterChange(config.key, e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder={config.placeholder}
                />
              </div>
            ) : config.type === 'select' ? (
              <select
                value={filters[config.key] || ''}
                onChange={(e) => onFilterChange(config.key, e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {config.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}
      </div>

      {/* Filter Results Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing <span className="font-medium text-gray-900">{resultsCount}</span> of <span className="font-medium text-gray-900">{totalCount}</span> items
        </div>
        {Object.values(filters).some(filter => filter !== '') && (
          <div className="flex items-center gap-2">
            <span className="text-blue-600">Filters applied</span>
            <div className="flex items-center gap-1">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                const config = filterConfig.find(c => c.key === key);
                if (!config) return null;
                
                return (
                  <span 
                    key={key}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    {config.label}: {value}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
