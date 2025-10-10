import React, { useState, useEffect } from 'react'
import { Activity, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, Filter, Download, BarChart3 } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import StatsCard from '../../../Shared/StatsCard/StatsCard'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReuseableFilter } from '../../../Shared/ReuseableFilter/ReuseableFilter'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { inventoryAPI, productsAPI, salesAPI } from '../services/inventoryService'

const StockAnalysis = () => {
  const [analysisData, setAnalysisData] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('fast-moving')
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    timeRange: '30',
    minSales: ''
  })

  // Analysis stats
  const [stats, setStats] = useState({
    fastMoving: 0,
    slowMoving: 0,
    deadStock: 0,
    totalProducts: 0
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
      const [inventoryData, productsData, salesData] = await Promise.all([
        inventoryAPI.getAll(),
        productsAPI.getAll(),
        salesAPI.getAll()
      ])
      
      setProducts(productsData)
      
      // Analyze stock movement
      const analysis = analyzeStockMovement(inventoryData, productsData, salesData)
      setAnalysisData(analysis)
      calculateStats(analysis)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeStockMovement = (inventoryData, productsData, salesData) => {
    const analysis = []
    const timeRange = parseInt(filters.timeRange) || 30
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - timeRange)
    
    productsData.forEach(product => {
      const inventoryItem = inventoryData.find(inv => inv.productId === product._id)
      if (!inventoryItem) return
      
      // Get sales data for this product in the time range
      const productSales = salesData.filter(sale => {
        const saleDate = new Date(sale.createdAt)
        return saleDate >= cutoffDate && 
               sale.items.some(item => item.productId === product._id)
      })
      
      // Calculate total sold quantity
      const totalSold = productSales.reduce((sum, sale) => {
        const item = sale.items.find(item => item.productId === product._id)
        return sum + (item?.quantity || 0)
      }, 0)
      
      // Get last sale date
      const lastSaleDate = productSales.length > 0 
        ? productSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt
        : null
      
      // Calculate days since last sale
      const daysSinceLastSale = lastSaleDate 
        ? Math.floor((new Date() - new Date(lastSaleDate)) / (1000 * 60 * 60 * 24))
        : null
      
      // Determine movement category
      let category = 'slow-moving'
      let status = 'Slow Moving'
      let statusColor = 'text-yellow-600 bg-yellow-100'
      let statusIcon = '🟡'
      
      if (totalSold === 0) {
        category = 'dead-stock'
        status = 'Dead Stock'
        statusColor = 'text-red-600 bg-red-100'
        statusIcon = '🔴'
      } else if (totalSold >= 50) {
        category = 'fast-moving'
        status = 'Fast Moving'
        statusColor = 'text-green-600 bg-green-100'
        statusIcon = '🟢'
      }
      
      // Calculate velocity (sales per day)
      const velocity = timeRange > 0 ? totalSold / timeRange : 0
      
      analysis.push({
        productId: product._id,
        productName: product.productName,
        sku: product.sku,
        category: product.category,
        currentStock: inventoryItem.stockQty,
        totalSold,
        lastSaleDate,
        daysSinceLastSale,
        velocity,
        movementCategory: category,
        status,
        statusColor,
        statusIcon,
        costPrice: product.costPrice || 0,
        sellingPrice: product.sellingPrice || 0,
        totalValue: inventoryItem.stockQty * (product.costPrice || 0)
      })
    })
    
    return analysis.sort((a, b) => b.totalSold - a.totalSold)
  }

  const calculateStats = (analysisData) => {
    const fastMoving = analysisData.filter(item => item.movementCategory === 'fast-moving').length
    const slowMoving = analysisData.filter(item => item.movementCategory === 'slow-moving').length
    const deadStock = analysisData.filter(item => item.movementCategory === 'dead-stock').length
    const totalProducts = analysisData.length
    
    setStats({
      fastMoving,
      slowMoving,
      deadStock,
      totalProducts
    })
  }

  const getFilteredData = () => {
    let filtered = analysisData.filter(item => {
      const matchesSearch = !filters.search || 
        item.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.sku?.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesCategory = !filters.category || item.category === filters.category
      const matchesMinSales = !filters.minSales || item.totalSold >= parseInt(filters.minSales)
      const matchesTab = activeTab === 'all' || item.movementCategory === activeTab

      return matchesSearch && matchesCategory && matchesMinSales && matchesTab
    })
    
    return filtered
  }

  const filterConfig = [
    {
      key: 'search',
      label: 'Search Products',
      type: 'search',
      placeholder: 'Search by name or SKU...'
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'All Categories', value: '' },
        ...Array.from(new Set(products.map(p => p.category))).map(cat => ({ label: cat, value: cat }))
      ]
    },
    {
      key: 'timeRange',
      label: 'Time Range (Days)',
      type: 'select',
      options: [
        { label: 'Last 7 Days', value: '7' },
        { label: 'Last 30 Days', value: '30' },
        { label: 'Last 90 Days', value: '90' },
        { label: 'Last 180 Days', value: '180' }
      ]
    },
    {
      key: 'minSales',
      label: 'Min Sales Qty',
      type: 'select',
      options: [
        { label: 'Any Quantity', value: '' },
        { label: '1+ Units', value: '1' },
        { label: '5+ Units', value: '5' },
        { label: '10+ Units', value: '10' },
        { label: '25+ Units', value: '25' }
      ]
    }
  ]

  const tableColumns = [
    {
      id: 'product',
      accessorKey: 'productName',
      header: 'Product',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.productName}</div>
          <div className="text-sm text-gray-500">SKU: {row.original.sku}</div>
          <div className="text-xs text-gray-400">{row.original.category}</div>
        </div>
      )
    },
    {
      id: 'totalSold',
      accessorKey: 'totalSold',
      header: 'Total Sold',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.totalSold}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'lastSaleDate',
      accessorKey: 'lastSaleDate',
      header: 'Last Sale Date',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">
            {row.original.lastSaleDate ? new Date(row.original.lastSaleDate).toLocaleDateString() : 'Never'}
          </div>
          {row.original.daysSinceLastSale !== null && (
            <div className="text-xs text-gray-500">
              {row.original.daysSinceLastSale} days ago
            </div>
          )}
        </div>
      )
    },
    {
      id: 'currentStock',
      accessorKey: 'currentStock',
      header: 'Stock Qty',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.currentStock}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'velocity',
      accessorKey: 'velocity',
      header: 'Velocity',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">{row.original.velocity.toFixed(2)}</div>
          <div className="text-xs text-gray-500">units/day</div>
        </div>
      )
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <span className="text-lg mr-2">{row.original.statusIcon}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.statusColor}`}>
            {row.original.status}
          </span>
        </div>
      )
    }
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      timeRange: '30',
      minSales: ''
    })
  }

  const handleExport = () => {
    console.log('Exporting stock analysis...')
  }

  const tabs = [
    { id: 'all', label: 'All Products', count: analysisData.length },
    { id: 'fast-moving', label: 'Fast Moving', count: stats.fastMoving },
    { id: 'slow-moving', label: 'Slow Moving', count: stats.slowMoving },
    { id: 'dead-stock', label: 'Dead Stock', count: stats.deadStock }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
        <p className="ml-3 text-gray-600">Analyzing stock movement...</p>
      </div>
    )
  }

  const filteredData = getFilteredData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 via-slate-50 to-zinc-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-gray-600" />
              Fast-moving & Dead Stock
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Analyze product movement and identify slow-moving items</p>
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
          label="Fast Moving"
          value={stats.fastMoving}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          label="Slow Moving"
          value={stats.slowMoving}
          icon={TrendingDown}
          color="yellow"
        />
        <StatsCard
          label="Dead Stock"
          value={stats.deadStock}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Activity}
          color="blue"
        />
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Stock Movement Analysis"
        message="This analysis helps you identify which products are selling well (fast-moving), which need attention (slow-moving), and which are not selling at all (dead stock). Use this data to optimize your inventory, pricing, and marketing strategies."
        icon={Activity}
      />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Analysis Filters"
        resultsCount={filteredData.length}
        totalCount={analysisData.length}
      />

      {/* Analysis Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-gray-600" />
            Stock Movement Analysis
          </h3>
        </div>
        <SharedTable
          data={filteredData}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No analysis data available"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
          Product Sales Comparison
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization will be implemented here</p>
            <p className="text-sm text-gray-400">Top 10 products by sales volume</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-gray-600" />
          Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Fast Moving Products</h4>
            <p className="text-sm text-green-700">
              Consider increasing stock levels and promoting these products to maximize sales.
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Slow Moving Products</h4>
            <p className="text-sm text-yellow-700">
              Review pricing, marketing strategies, or consider bundling with popular items.
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Dead Stock</h4>
            <p className="text-sm text-red-700">
              Consider clearance sales, donations, or disposal to free up warehouse space.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockAnalysis
