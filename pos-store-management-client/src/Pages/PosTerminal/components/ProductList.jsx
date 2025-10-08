import React, { useState } from 'react'
import { Search, Package, Plus } from 'lucide-react'
import Button from '../../../Components/UI/Button'

const ProductList = ({ products, inventory, onAddToCart, filters, onFilterChange }) => {
  const getProductStock = (productId) => {
    // Find ALL inventory records for this product (across all locations)
    const inventoryItems = inventory.filter(item => item.productId === productId)
    
    if (inventoryItems.length === 0) {
      return 0
    }
    
    // Sum up stock from all locations
    const totalStock = inventoryItems.reduce((sum, item) => {
      return sum + (item.stockQty || 0)
    }, 0)
    
    return Math.max(0, totalStock)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search product / Scan barcode..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {[...new Set(products.map(p => p.category))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={filters.warehouse}
            onChange={(e) => onFilterChange('warehouse', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Warehouses</option>
            {[...new Set(inventory.map(i => i.location))].filter(Boolean).map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {products.length > 0 ? (
            products.map(product => {
              const stock = getProductStock(product._id)
              const price = product.sellingPrice || product.price || 0
              
              return (
                <div
                  key={product._id}
                  className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.productImage || 'https://via.placeholder.com/60'}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{product.productName}</h4>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-bold text-blue-600">${price.toFixed(2)}</span>
                        <div className="text-right">
                          <span className={`text-sm font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Stock: {stock}
                          </span>
                          {(() => {
                            const inventoryItems = inventory.filter(item => item.productId === product._id)
                            if (inventoryItems.length > 1) {
                              return <p className="text-xs text-blue-600">({inventoryItems.length} locations)</p>
                            }
                            return null
                          })()}
                          {stock <= 5 && stock > 0 && (
                            <p className="text-xs text-orange-600">Low Stock!</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onAddToCart(product, price)}
                      disabled={stock === 0}
                      className="flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Package className="w-16 h-16 mb-3" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList

