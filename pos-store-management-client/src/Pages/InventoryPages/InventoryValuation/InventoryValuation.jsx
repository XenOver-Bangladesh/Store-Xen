import React, { useState, useEffect } from 'react'
import { Calculator, Package, TrendingUp, PieChart, RefreshCw, Filter, Download, DollarSign } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import StatsCard from '../../../Shared/StatsCard/StatsCard'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReuseableFilter } from '../../../Shared/ReuseableFilter/ReuseableFilter'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { inventoryAPI, productsAPI, warehousesAPI } from '../services/inventoryService'
import { ChartLoading } from '../../../Components/UI/LoadingAnimation'

const InventoryValuation = () => {
  const [valuationData, setValuationData] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    warehouse: '',
    valueRange: ''
  })

  // Summary stats
  const [summary, setSummary] = useState({
    totalValue: 0,
    totalItems: 0,
    averageMargin: 0,
    categoryBreakdown: []
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
      
      setProducts(productsData)
      setWarehouses(warehousesData)
      
      // Calculate valuation data
      const valuation = calculateValuation(inventoryData, productsData)
      setValuationData(valuation)
      
      // Calculate summary
      calculateSummary(valuation)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateValuation = (inventoryData, productsData) => {
    const valuation = []
    
    inventoryData.forEach(inventoryItem => {
      const product = productsData.find(p => p._id === inventoryItem.productId)
      if (!product) return
      
      const quantity = inventoryItem.stockQty
      const costPrice = product.costPrice || 0
      const sellingPrice = product.sellingPrice || 0
      const totalValue = quantity * costPrice
      const potentialValue = quantity * sellingPrice
      const margin = sellingPrice - costPrice
      const marginPercentage = costPrice > 0 ? ((margin / costPrice) * 100) : 0
      
      valuation.push({
        productId: product._id,
        productName: product.productName,
        sku: product.sku,
        category: product.category,
        location: inventoryItem.location,
        quantity,
        costPrice,
        sellingPrice,
        totalValue,
        potentialValue,
        margin,
        marginPercentage,
        lastUpdated: inventoryItem.updatedAt || inventoryItem.createdAt
      })
    })
    
    return valuation.sort((a, b) => b.totalValue - a.totalValue)
  }

  const calculateSummary = (valuationData) => {
    const totalValue = valuationData.reduce((sum, item) => sum + item.totalValue, 0)
    const totalItems = valuationData.length
    const totalMargin = valuationData.reduce((sum, item) => sum + item.margin, 0)
    const averageMargin = totalItems > 0 ? (totalMargin / totalItems) : 0
    
    // Category breakdown
    const categoryBreakdown = {}
    valuationData.forEach(item => {
      if (!categoryBreakdown[item.category]) {
        categoryBreakdown[item.category] = {
          count: 0,
          value: 0,
          margin: 0
        }
      }
      categoryBreakdown[item.category].count += 1
      categoryBreakdown[item.category].value += item.totalValue
      categoryBreakdown[item.category].margin += item.margin
    })
    
    const categoryArray = Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      count: data.count,
      value: data.value,
      margin: data.margin,
      marginPercentage: data.value > 0 ? ((data.margin / data.value) * 100) : 0
    })).sort((a, b) => b.value - a.value)
    
    setSummary({
      totalValue,
      totalItems,
      averageMargin,
      categoryBreakdown: categoryArray
    })
  }

  const getMarginColor = (marginPercentage) => {
    if (marginPercentage >= 50) return 'text-green-600 bg-green-100'
    if (marginPercentage >= 25) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getValueRange = (value) => {
    if (value >= 10000) return 'High'
    if (value >= 1000) return 'Medium'
    return 'Low'
  }

  const filteredValuation = valuationData.filter(item => {
    const matchesSearch = !filters.search || 
      item.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCategory = !filters.category || item.category === filters.category
    const matchesWarehouse = !filters.warehouse || item.location === filters.warehouse
    
    const matchesValueRange = !filters.valueRange || 
      (filters.valueRange === 'high' && item.totalValue >= 10000) ||
      (filters.valueRange === 'medium' && item.totalValue >= 1000 && item.totalValue < 10000) ||
      (filters.valueRange === 'low' && item.totalValue < 1000)

    return matchesSearch && matchesCategory && matchesWarehouse && matchesValueRange
  })

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
      key: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      options: [
        { label: 'All Warehouses', value: '' },
        ...warehouses.map(w => ({ label: w.name, value: w.name }))
      ]
    },
    {
      key: 'valueRange',
      label: 'Value Range',
      type: 'select',
      options: [
        { label: 'All Values', value: '' },
        { label: 'High (≥BDT 10,000)', value: 'high' },
        { label: 'Medium (BDT 1,000-9,999)', value: 'medium' },
        { label: 'Low (<BDT 1,000)', value: 'low' }
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
      id: 'quantity',
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.quantity}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'costPrice',
      accessorKey: 'costPrice',
      header: 'Cost Price',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">BDT {row.original.costPrice.toFixed(2)}</div>
          <div className="text-xs text-gray-500">per unit</div>
        </div>
      )
    },
    {
      id: 'totalValue',
      accessorKey: 'totalValue',
      header: 'Total Value (BDT)',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="text-lg font-semibold text-blue-600">BDT {row.original.totalValue.toFixed(2)}</div>
          <div className="text-xs text-gray-500">{getValueRange(row.original.totalValue)} Value</div>
        </div>
      )
    },
    {
      id: 'margin',
      accessorKey: 'marginPercentage',
      header: 'Margin %',
      cell: ({ row }) => (
        <div className="text-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMarginColor(row.original.marginPercentage)}`}>
            {row.original.marginPercentage.toFixed(1)}%
          </span>
          <div className="text-xs text-gray-500 mt-1">BDT {row.original.margin.toFixed(2)}</div>
        </div>
      )
    },
    {
      id: 'potentialValue',
      accessorKey: 'potentialValue',
      header: 'Potential Value',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium text-green-600">BDT {row.original.potentialValue.toFixed(2)}</div>
          <div className="text-xs text-gray-500">if sold</div>
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
      warehouse: '',
      valueRange: ''
    })
  }

  const handleExport = () => {
    console.log('Exporting valuation data...')
  }

  if (loading) {
    return <ChartLoading message="Calculating inventory valuation..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Calculator className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-green-600" />
              Inventory Valuation
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Track total stock value and cost-based valuation</p>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Stock Value"
          value={`BDT ${summary.totalValue.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          label="Total Items"
          value={summary.totalItems}
          icon={Package}
          color="blue"
        />
        <StatsCard
          label="Average Margin"
          value={`${summary.averageMargin.toFixed(1)}%`}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          label="Categories"
          value={summary.categoryBreakdown.length}
          icon={PieChart}
          color="yellow"
        />
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Inventory Valuation Analysis"
        message="This report shows the current value of your inventory based on cost prices. Monitor margin percentages to identify high-value items and optimize your pricing strategy. Green margins indicate healthy profitability."
        icon={Calculator}
      />

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-green-600" />
          Category-wise Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.categoryBreakdown.map((category, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{category.category}</h4>
                <span className="text-sm text-gray-500">{category.count} items</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-medium">BDT {category.value.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Margin:</span>
                  <span className={`font-medium ${getMarginColor(category.marginPercentage).split(' ')[0]}`}>
                    {category.marginPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Valuation Filters"
        resultsCount={filteredValuation.length}
        totalCount={valuationData.length}
      />

      {/* Valuation Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-green-600" />
            Inventory Valuation Details
          </h3>
        </div>
        <SharedTable
          data={filteredValuation}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No valuation data available"
        />
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-green-600" />
          Value Distribution Chart
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization will be implemented here</p>
            <p className="text-sm text-gray-400">Category-wise value distribution</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryValuation
