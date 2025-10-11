import React, { useState, useEffect } from 'react'
import { RotateCcw, Package, TrendingUp, Plus, RefreshCw, Filter, Download, CheckCircle } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import StatsCard from '../../../Shared/StatsCard/StatsCard'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReuseableFilter } from '../../../Shared/ReuseableFilter/ReuseableFilter'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { inventoryAPI, productsAPI, suppliersAPI, purchaseOrdersAPI, salesAPI } from '../services/inventoryService'
import Swal from 'sweetalert2'
import { InventoryLoading } from '../../../Components/UI/LoadingAnimation'

const AutoReorderSuggestions = () => {
  const [suggestions, setSuggestions] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState([])
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: '',
    priority: ''
  })

  // Stats data
  const [stats, setStats] = useState({
    totalSuggestions: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
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
      const [inventoryData, productsData, suppliersData, salesData] = await Promise.all([
        inventoryAPI.getAll(),
        productsAPI.getAll(),
        suppliersAPI.getAll(),
        salesAPI.getAll()
      ])
      
      setProducts(productsData)
      setSuppliers(suppliersData)
      setSales(salesData)
      
      // Generate reorder suggestions
      const suggestions = generateReorderSuggestions(inventoryData, productsData, salesData)
      setSuggestions(suggestions)
      calculateStats(suggestions)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReorderSuggestions = (inventoryData, productsData, salesData) => {
    const suggestions = []
    
    productsData.forEach(product => {
      const inventoryItem = inventoryData.find(inv => inv.productId === product._id)
      if (!inventoryItem) return
      
      // Calculate average monthly sales
      const monthlySales = calculateMonthlySales(product._id, salesData)
      const currentStock = inventoryItem.stockQty
      const minStockLevel = product.minStockLevel || 10
      const leadTime = product.leadTime || 7 // days
      const safetyStock = Math.ceil(monthlySales * 0.2) // 20% safety buffer
      
      // Calculate suggested quantity
      const suggestedQty = Math.max(
        monthlySales * 2, // 2 months supply
        minStockLevel * 3, // 3x minimum level
        safetyStock * 2 // 2x safety stock
      )
      
      // Calculate priority
      let priority = 'Low'
      if (currentStock <= minStockLevel * 0.5) priority = 'High'
      else if (currentStock <= minStockLevel) priority = 'Medium'
      
      // Calculate urgency score
      const urgencyScore = (monthlySales * 30) / (currentStock + 1) // sales per day / current stock
      
      if (suggestedQty > 0 && (currentStock < minStockLevel * 2 || urgencyScore > 1)) {
        suggestions.push({
          productId: product._id,
          productName: product.productName,
          sku: product.sku,
          category: product.category,
          supplierId: product.supplierId,
          currentStock,
          monthlySales,
          suggestedQty: Math.ceil(suggestedQty),
          priority,
          urgencyScore,
          lastSaleDate: getLastSaleDate(product._id, salesData),
          costPrice: product.costPrice || 0,
          totalValue: Math.ceil(suggestedQty) * (product.costPrice || 0)
        })
      }
    })
    
    return suggestions.sort((a, b) => b.urgencyScore - a.urgencyScore)
  }

  const calculateMonthlySales = (productId, salesData) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentSales = salesData.filter(sale => 
      new Date(sale.createdAt) >= thirtyDaysAgo &&
      sale.items.some(item => item.productId === productId)
    )
    
    const totalSold = recentSales.reduce((sum, sale) => {
      const item = sale.items.find(item => item.productId === productId)
      return sum + (item?.quantity || 0)
    }, 0)
    
    return totalSold
  }

  const getLastSaleDate = (productId, salesData) => {
    const productSales = salesData.filter(sale => 
      sale.items.some(item => item.productId === productId)
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    return productSales[0]?.createdAt || null
  }

  const calculateStats = (suggestionsData) => {
    const totalSuggestions = suggestionsData.length
    const highPriority = suggestionsData.filter(s => s.priority === 'High').length
    const mediumPriority = suggestionsData.filter(s => s.priority === 'Medium').length
    const lowPriority = suggestionsData.filter(s => s.priority === 'Low').length
    
    setStats({
      totalSuggestions,
      highPriority,
      mediumPriority,
      lowPriority
    })
  }

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'text-red-600 bg-red-100',
      Medium: 'text-yellow-600 bg-yellow-100',
      Low: 'text-green-600 bg-green-100'
    }
    return colors[priority] || colors.Low
  }

  const getPriorityIcon = (priority) => {
    const icons = {
      High: '🔴',
      Medium: '🟡',
      Low: '🟢'
    }
    return icons[priority] || '🟢'
  }

  const filteredSuggestions = suggestions.filter(item => {
    const matchesSearch = !filters.search || 
      item.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCategory = !filters.category || item.category === filters.category
    const matchesSupplier = !filters.supplier || item.supplierId === filters.supplier
    const matchesPriority = !filters.priority || item.priority === filters.priority

    return matchesSearch && matchesCategory && matchesSupplier && matchesPriority
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
      key: 'supplier',
      label: 'Supplier',
      type: 'select',
      options: [
        { label: 'All Suppliers', value: '' },
        ...suppliers.map(s => ({ label: s.name, value: s._id }))
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { label: 'All Priorities', value: '' },
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
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
        </div>
      )
    },
    {
      id: 'sales',
      accessorKey: 'monthlySales',
      header: 'Avg Monthly Sale',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.monthlySales}</div>
          <div className="text-xs text-gray-500">units/month</div>
        </div>
      )
    },
    {
      id: 'currentStock',
      accessorKey: 'currentStock',
      header: 'Current Stock',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.currentStock}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'suggestedQty',
      accessorKey: 'suggestedQty',
      header: 'Suggested Qty',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{row.original.suggestedQty}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'supplier',
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => {
        const item = row.original
        const supplier = suppliers.find(s => s._id === item.supplierId)
        return (
          <div className="text-center">
            <div className="font-medium text-gray-900">{supplier?.name || 'Unknown'}</div>
          </div>
        )
      }
    },
    {
      id: 'priority',
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <span className="text-lg mr-2">{getPriorityIcon(row.original.priority)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(row.original.priority)}`}>
            {row.original.priority}
          </span>
        </div>
      )
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAddToPO(row.original)}
          >
            <div className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add to PO
            </div>
          </Button>
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
      supplier: '',
      priority: ''
    })
  }

  const handleExport = () => {
    console.log('Exporting reorder suggestions...')
  }

  const handleAddToPO = async (item) => {
    const supplier = suppliers.find(s => s._id === item.supplierId)
    
    if (!supplier) {
      Swal.fire('Error', 'No supplier found for this product', 'error')
      return
    }

    try {
      const poData = {
        supplierId: supplier._id,
        supplierName: supplier.name,
        items: [{
          productId: item.productId,
          productName: item.productName,
          quantity: item.suggestedQty,
          unitPrice: item.costPrice,
          totalPrice: item.totalValue
        }],
        status: 'Draft',
        notes: `Auto-generated PO from reorder suggestion - ${item.productName}`
      }

      await purchaseOrdersAPI.create(poData)
      
      Swal.fire({
        title: 'Success!',
        text: `Purchase order created for ${item.productName}`,
        icon: 'success'
      })
      
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error creating PO:', error)
      Swal.fire('Error', 'Failed to create purchase order', 'error')
    }
  }

  const handleSelectAll = () => {
    setSelectedItems(filteredSuggestions)
  }

  const handleDeselectAll = () => {
    setSelectedItems([])
  }

  const handleGenerateAll = () => {
    setSelectedItems(filteredSuggestions)
    setShowGenerateModal(true)
  }

  const handleGenerateConfirm = async () => {
    try {
      // Group by supplier
      const supplierGroups = {}
      selectedItems.forEach(item => {
        if (!supplierGroups[item.supplierId]) {
          supplierGroups[item.supplierId] = []
        }
        supplierGroups[item.supplierId].push(item)
      })

      // Create PO for each supplier
      for (const [supplierId, items] of Object.entries(supplierGroups)) {
        const supplier = suppliers.find(s => s._id === supplierId)
        if (!supplier) continue

        const poData = {
          supplierId: supplier._id,
          supplierName: supplier.name,
          items: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.suggestedQty,
            unitPrice: item.costPrice,
            totalPrice: item.totalValue
          })),
          status: 'Draft',
          notes: `Auto-generated bulk PO for ${items.length} items`
        }

        await purchaseOrdersAPI.create(poData)
      }
      
      Swal.fire({
        title: 'Success!',
        text: `Generated ${Object.keys(supplierGroups).length} purchase orders for ${selectedItems.length} items`,
        icon: 'success'
      })
      
      setShowGenerateModal(false)
      setSelectedItems([])
      fetchData()
    } catch (error) {
      console.error('Error generating POs:', error)
      Swal.fire('Error', 'Failed to generate purchase orders', 'error')
    }
  }

  if (loading) {
    return <InventoryLoading message="Generating reorder suggestions..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-purple-600" />
              Auto Reorder Suggestions
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">AI-powered suggestions for optimal inventory management</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateAll}
              disabled={filteredSuggestions.length === 0}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Generate All</span>
              </div>
            </Button>
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
          label="Total Suggestions"
          value={stats.totalSuggestions}
          icon={Package}
          color="purple"
        />
        <StatsCard
          label="High Priority"
          value={stats.highPriority}
          icon={TrendingUp}
          color="red"
        />
        <StatsCard
          label="Medium Priority"
          value={stats.mediumPriority}
          icon={TrendingUp}
          color="yellow"
        />
        <StatsCard
          label="Low Priority"
          value={stats.lowPriority}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Smart Reorder System"
        message="Our AI analyzes your sales patterns, current stock levels, and lead times to suggest optimal reorder quantities. High priority items need immediate attention, while medium and low priority items can be planned for future orders."
        icon={RotateCcw}
      />

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={handleSelectAll}
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Select All
          </div>
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={handleDeselectAll}
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Deselect All
          </div>
        </Button>
        <div className="text-sm text-gray-600">
          {selectedItems.length} items selected
        </div>
      </div>

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Suggestion Filters"
        resultsCount={filteredSuggestions.length}
        totalCount={suggestions.length}
      />

      {/* Suggestions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-purple-600" />
            Reorder Suggestions
          </h3>
        </div>
        <SharedTable
          data={filteredSuggestions}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No reorder suggestions available"
        />
      </div>

      {/* Generate All Modal */}
      <SharedModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate All Purchase Orders"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            You are about to generate purchase orders for {selectedItems.length} suggested items.
            Items will be grouped by supplier for efficient ordering.
          </p>
          <div className="max-h-64 overflow-y-auto">
            {selectedItems.map((item, index) => {
              const supplier = suppliers.find(s => s._id === item.supplierId)
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-500">Supplier: {supplier?.name || 'Unknown'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Qty: {item.suggestedQty} units</div>
                    <div className="text-sm text-gray-600">Value: BDT {item.totalValue.toFixed(2)}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowGenerateModal(false)}
            >
              <div className="flex items-center">
                Cancel
              </div>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerateConfirm}
            >
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Generate POs
              </div>
            </Button>
          </div>
        </div>
      </SharedModal>
    </div>
  )
}

export default AutoReorderSuggestions
