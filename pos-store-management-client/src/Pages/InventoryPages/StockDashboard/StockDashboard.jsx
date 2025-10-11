import React, { useState, useEffect } from 'react'
import { BarChart3, Package, TrendingUp, AlertTriangle, RefreshCw, Filter, Download } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import StatsCard from '../../../Shared/StatsCard/StatsCard'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReuseableFilter } from '../../../Shared/ReuseableFilter/ReuseableFilter'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { inventoryAPI, productsAPI, warehousesAPI } from '../services/inventoryService'
import { InventoryLoading } from '../../../Components/UI/LoadingAnimation'

const StockDashboard = () => {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    warehouse: '',
    status: '',
    category: ''
  })

  // Stats data
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    fastMoving: 0,
    lowStock: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [inventoryData, productsData, warehousesData] = await Promise.all([
        inventoryAPI.getAll(),
        productsAPI.getAll(),
        warehousesAPI.getAll()
      ])
      
      setInventory(inventoryData)
      setProducts(productsData)
      setWarehouses(warehousesData)
      
      // Calculate stats
      calculateStats(inventoryData, productsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (inventoryData, productsData) => {
    console.log('StockDashboard - Calculating stats with data:', {
      inventoryData: inventoryData,
      productsData: productsData,
      inventoryLength: inventoryData.length,
      productsLength: productsData.length
    })
    
    const totalProducts = productsData.length
    const totalValue = inventoryData.reduce((sum, item) => {
      const product = productsData.find(p => p._id === item.productId)
      const stockQty = item.stockQty || item.quantity || item.stock || 0
      const costPrice = product?.costPrice || product?.purchasePrice || 0
      
      console.log(`StockDashboard - Item: ${item.productName || 'Unknown'}, StockQty: ${stockQty}, CostPrice: ${costPrice}, Product:`, product)
      
      return sum + (stockQty * costPrice)
    }, 0)
    
    const lowStock = inventoryData.filter(item => item.stockQty < 10).length
    const fastMoving = inventoryData.filter(item => item.stockQty > 100).length
    
    console.log('StockDashboard - Calculated stats:', {
      totalProducts,
      totalValue,
      lowStock,
      fastMoving
    })
    
    setStats({
      totalProducts,
      totalValue: totalValue.toFixed(2),
      fastMoving,
      lowStock
    })
  }

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' }
    if (quantity < 10) return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' }
    return { status: 'In Stock', color: 'text-green-600 bg-green-100' }
  }

  const getStatusIcon = (quantity) => {
    if (quantity === 0) return '🔴'
    if (quantity < 10) return '🟡'
    return '🟢'
  }

  const filteredInventory = inventory.filter(item => {
    const product = products.find(p => p._id === item.productId)
    if (!product) return false

    const matchesSearch = !filters.search || 
      product.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesWarehouse = !filters.warehouse || item.location === filters.warehouse
    const matchesCategory = !filters.category || product.category === filters.category
    
    const matchesStatus = !filters.status || 
      (filters.status === 'in-stock' && item.stockQty >= 10) ||
      (filters.status === 'low-stock' && item.stockQty < 10 && item.stockQty > 0) ||
      (filters.status === 'out-of-stock' && item.stockQty === 0)

    return matchesSearch && matchesWarehouse && matchesCategory && matchesStatus
  })

  const filterConfig = [
    {
      key: 'search',
      label: 'Search Products',
      type: 'search',
      placeholder: 'Search by name or SKU...'
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      options: [
        { label: 'All Warehouses', value: '' },
        ...warehouses.map(w => ({ label: w.name, value: w.name }))
      ]
    },
    {
      key: 'status',
      label: 'Stock Status',
      type: 'select',
      options: [
        { label: 'All Status', value: '' },
        { label: 'In Stock', value: 'in-stock' },
        { label: 'Low Stock', value: 'low-stock' },
        { label: 'Out of Stock', value: 'out-of-stock' }
      ]
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'All Categories', value: '' },
        ...Array.from(new Set(products.map(p => p.category))).map(cat => ({ label: cat, value: cat }))
      ]
    }
  ]

  const tableColumns = [
    {
      id: 'product',
      accessorKey: 'product',
      header: 'Product',
      cell: ({ row }) => {
        const item = row.original
        const product = products.find(p => p._id === item.productId)
        return (
          <div>
            <div className="font-medium text-gray-900">{product?.productName || 'Unknown'}</div>
            <div className="text-sm text-gray-500">SKU: {product?.sku || 'N/A'}</div>
          </div>
        )
      }
    },
    {
      id: 'quantity',
      accessorKey: 'stockQty',
      header: 'Current Qty',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.stockQty}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'location',
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">{row.original.location}</div>
        </div>
      )
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const item = row.original
        const statusInfo = getStockStatus(item.stockQty)
        return (
          <div className="flex items-center justify-center">
            <span className="text-lg mr-2">{getStatusIcon(item.stockQty)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
          </div>
        )
      }
    },
    {
      id: 'value',
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => {
        const item = row.original
        const product = products.find(p => p._id === item.productId)
        const value = item.stockQty * (product?.costPrice || 0)
        return (
          <div className="text-right">
            <div className="font-medium text-gray-900">BDT {value.toFixed(2)}</div>
            <div className="text-xs text-gray-500">BDT {product?.costPrice || 0} each</div>
          </div>
        )
      }
    }
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      warehouse: '',
      status: '',
      category: ''
    })
  }

  const handleExport = () => {
    // Export functionality
    console.log('Exporting stock data...')
  }

  if (loading) {
    return <InventoryLoading message="Loading stock data..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
              Real-time Stock Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Monitor warehouse stock in real-time with live updates</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchData}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Refresh</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Products in Stock"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
        />
        <StatsCard
          label="Total Stock Value"
          value={`BDT ${stats.totalValue}`}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          label="Fast-moving Products"
          value={stats.fastMoving}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          label="Low Stock Count"
          value={stats.lowStock}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Live Stock Monitoring"
        message="This dashboard shows real-time inventory levels across all warehouses. Use the filters to focus on specific products, locations, or stock status. Green indicates healthy stock levels, yellow shows low stock, and red indicates out of stock items."
        icon={BarChart3}
      />

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Stock Filters"
        resultsCount={filteredInventory.length}
        totalCount={inventory.length}
      />

      {/* Stock Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Live Stock Table
          </h3>
        </div>
        <SharedTable
          data={filteredInventory}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No stock data available"
        />
      </div>

      {/* Quick Graph Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Product Stock Comparison
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization will be implemented here</p>
            <p className="text-sm text-gray-400">Top 10 products by stock quantity</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockDashboard
