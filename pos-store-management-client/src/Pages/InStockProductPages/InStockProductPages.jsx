import React, { useState, useEffect, useMemo } from 'react'
import { RefreshCw, Package, AlertTriangle, TrendingUp, XCircle, Clock, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import InventoryList from './components/InventoryList'
import InventoryFilter from './components/InventoryFilter'
import { inventoryAPI, productsAPI } from './services/inventoryService'
import { formatDate, getExpiryStatus } from './utils/inventoryHelpers'

export const InStockProductPages = () => {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [fetchLoading, setFetchLoading] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    expiryStatus: '',
    location: ''
  })

  // Fetch data on mount
  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAllData = async () => {
    await Promise.all([
      fetchInventory(),
      fetchProducts()
    ])
  }

  const fetchInventory = async () => {
    try {
      setFetchLoading(true)
      const data = await inventoryAPI.getAll()
      setInventory(data || [])
    } catch (error) {
      console.error('Error fetching inventory:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch inventory. Please try again.',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setFetchLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll()
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Filter handler
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean)
    return [...new Set(cats)]
  }, [products])

  // Filtered and sorted inventory
  const filteredInventory = useMemo(() => {
    const filtered = inventory.filter(item => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!item.productName?.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      // Category filter
      if (filters.category) {
        const product = products.find(p => p._id === item.productId)
        if (product?.category !== filters.category) {
          return false
        }
      }

      // Stock status filter
      if (filters.stockStatus) {
        const stockQty = item.stockQty || 0
        const product = products.find(p => p._id === item.productId)
        const lowStockThreshold = product?.lowStockThreshold || 10

        if (filters.stockStatus === 'out-of-stock' && stockQty !== 0) return false
        if (filters.stockStatus === 'low-stock' && (stockQty === 0 || stockQty > lowStockThreshold)) return false
        if (filters.stockStatus === 'in-stock' && stockQty <= lowStockThreshold) return false
      }

      // Expiry status filter
      if (filters.expiryStatus) {
        const expiryStatus = getExpiryStatus(item.expiry)
        if (!expiryStatus) return false

        if (filters.expiryStatus === 'expired' && expiryStatus.status !== 'Expired') return false
        if (filters.expiryStatus === 'expiring-soon' && expiryStatus.status !== 'Expiring Soon') return false
        if (filters.expiryStatus === 'valid' && expiryStatus.status !== 'Valid') return false
      }

      // Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase()
        if (!item.location?.toLowerCase().includes(locationLower)) {
          return false
        }
      }

      return true
    })

    // Sort by updatedAt (newest first)
    return filtered.sort((a, b) => {
      if (a.updatedAt && b.updatedAt) {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      }
      return 0
    })
  }, [inventory, products, filters])

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalProducts = inventory.length
    const totalStock = inventory.reduce((sum, item) => sum + (item.stockQty || 0), 0)
    
    const lowStock = inventory.filter(item => {
      const stockQty = item.stockQty || 0
      const product = products.find(p => p._id === item.productId)
      const lowStockThreshold = product?.lowStockThreshold || 10
      return stockQty > 0 && stockQty <= lowStockThreshold
    }).length

    const outOfStock = inventory.filter(item => (item.stockQty || 0) === 0).length
    
    const expiring = inventory.filter(item => {
      const expiryStatus = getExpiryStatus(item.expiry)
      return expiryStatus && (expiryStatus.status === 'Expired' || expiryStatus.status === 'Expiring Soon')
    }).length

    return { totalProducts, totalStock, lowStock, outOfStock, expiring }
  }, [inventory, products])

  const handleView = (item) => {
    const product = products.find(p => p._id === item.productId)
    const expiryStatus = getExpiryStatus(item.expiry)

    Swal.fire({
      title: `<div class="flex items-center justify-center"><svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>${item.productName}</div>`,
      html: `
        <div class="text-left space-y-4 max-h-96 overflow-y-auto">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-gray-600 font-semibold">Product ID</p>
              <p class="text-gray-900 font-mono text-xs">${item.productId}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">SKU</p>
              <p class="text-gray-900 font-mono">${product?.sku || 'N/A'}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Category</p>
              <p class="text-gray-900">${product?.category || 'N/A'}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Batch Number</p>
              <p class="text-gray-900 font-mono">${item.batch || 'N/A'}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Expiry Date</p>
              <p class="text-gray-900">${item.expiry ? formatDate(item.expiry).split(',')[0] : 'N/A'}</p>
              ${expiryStatus ? `<p class="${expiryStatus.color} text-xs font-semibold">${expiryStatus.status}</p>` : ''}
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Location</p>
              <p class="text-gray-900">${item.location || 'Main Warehouse'}</p>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-center">
              <p class="text-sm text-gray-600">Current Stock Quantity</p>
              <p class="text-4xl font-bold text-blue-600 mt-2">${item.stockQty || 0}</p>
              <p class="text-xs text-gray-500 mt-1">units available</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-gray-600 font-semibold">Created At</p>
              <p class="text-gray-900 text-xs">${formatDate(item.createdAt)}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Last Updated</p>
              <p class="text-gray-900 text-xs">${formatDate(item.updatedAt)}</p>
            </div>
          </div>

          ${product ? `
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-600 font-semibold mb-2">Product Details</p>
              <p class="text-sm text-gray-700">Price: <strong>$${product.sellingPrice || 'N/A'}</strong></p>
              <p class="text-sm text-gray-700">Low Stock Alert: <strong>${product.lowStockThreshold || 10} units</strong></p>
              ${product.description ? `<p class="text-sm text-gray-700 mt-2">${product.description}</p>` : ''}
            </div>
          ` : ''}
        </div>
      `,
      width: '700px',
      confirmButtonColor: '#3B82F6',
      confirmButtonText: 'Close'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              Inhouse Products / Warehouse Stock
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and monitor warehouse inventory
            </p>
            
            
          </div>

          <Button 
            variant="secondary" 
            size="md"
            onClick={fetchAllData}
            disabled={fetchLoading}
            loading={fetchLoading}
            className="flex items-center"
          >
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              <span>Refresh</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Warehouse Inventory Management</p>
          <p className="text-sm text-blue-700 mt-1">
            Monitor all products in your warehouse with real-time stock levels, batch tracking, expiry dates, 
            and location information. Stock is automatically updated through GRN entries.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="gray"
        />
        <StatsCard
          label="Total Stock"
          value={stats.totalStock}
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          label="Low Stock"
          value={stats.lowStock}
          icon={AlertTriangle}
          color="yellow"
        />
        <StatsCard
          label="Out of Stock"
          value={stats.outOfStock}
          icon={XCircle}
          color="red"
        />
        <StatsCard
          label="Expiring Soon"
          value={stats.expiring}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Filter Section */}
      <InventoryFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        resultsCount={filteredInventory.length}
        totalCount={inventory.length}
      />

      {/* Inventory List */}
      <InventoryList
        inventory={filteredInventory}
        products={products}
        loading={fetchLoading}
        onView={handleView}
      />
    </div>
  )
}

export default InStockProductPages
