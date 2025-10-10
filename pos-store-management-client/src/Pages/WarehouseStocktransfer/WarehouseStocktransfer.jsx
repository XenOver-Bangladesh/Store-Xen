import React, { useState, useEffect, useCallback } from 'react'
import { ArrowRightLeft, Search, Package, AlertCircle, CheckCircle, AlertTriangle, RefreshCw, TrendingUp, Warehouse } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { ReuseableFilter } from '../../Shared/ReuseableFilter/ReuseableFilter'
import SharedModal from '../../Shared/SharedModal/SharedModal'
import axios from 'axios'

const API_URL = 'https://pos-system-management-server-20.vercel.app'

const WarehouseStocktransfer = () => {
  const [inventory, setInventory] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [transfers, setTransfers] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [warehousesLoading, setWarehousesLoading] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  const [transferData, setTransferData] = useState({
    sourceWarehouse: '',
    destinationWarehouse: '',
    quantity: 0
  })

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    warehouse: ''
  })

  useEffect(() => {
    fetchAllData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAllData = async () => {
    setLoading(true)
    setWarehousesLoading(true)
    try {
      const [invResponse, warehouseResponse, transferResponse] = await Promise.all([
        axios.get(`${API_URL}/inventory`),
        axios.get(`${API_URL}/warehouses`),
        axios.get(`${API_URL}/stock-transfers`)
      ])
      setInventory(invResponse.data)
      setWarehouses(warehouseResponse.data)
      setTransfers(transferResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      
      // Set fallback warehouses if API fails
      if (warehouses.length === 0) {
        setWarehouses([
          { _id: '1', name: 'Main Warehouse', location: 'Building A' },
          { _id: '2', name: 'Secondary Warehouse', location: 'Building B' },
          { _id: '3', name: 'Cold Storage', location: 'Building C' },
          { _id: '4', name: 'Dry Storage', location: 'Building D' },
          { _id: '5', name: 'Returns Warehouse', location: 'Building E' }
        ])
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch some data. Using fallback warehouses.',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setLoading(false)
      setWarehousesLoading(false)
    }
  }

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...inventory]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(item => 
        item.productName?.toLowerCase().includes(searchLower) ||
        item.productId?.toLowerCase().includes(searchLower)
      )
    }

    // Warehouse filter
    if (filters.warehouse) {
      filtered = filtered.filter(item => item.location === filters.warehouse)
    }

    // Only show items with stock > 0
    filtered = filtered.filter(item => (item.stockQty || 0) > 0)

    setFilteredInventory(filtered)
  }, [inventory, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', warehouse: '' })
  }

  const handleExport = () => {
    // Export to CSV
    const csv = [
      ['Product Name', 'Product ID', 'Warehouse', 'Stock Quantity', 'Batch Number', 'Expiry Date'],
      ...filteredInventory.map(item => [
        item.productName || '',
        item.productId || '',
        item.location || '',
        item.stockQty || 0,
        item.batchNumber || '',
        item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `warehouse-stock-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleOpenTransferModal = (item) => {
    setSelectedItem(item)
    setTransferData({
      sourceWarehouse: item.location || '',
      destinationWarehouse: '',
      quantity: item.stockQty || 0
    })
    setTransferModalOpen(true)
  }

  const handleTransferSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!transferData.destinationWarehouse) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select a destination warehouse',
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    if (transferData.sourceWarehouse === transferData.destinationWarehouse) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Transfer',
        text: 'Source and destination warehouses must be different',
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    if (!transferData.quantity || transferData.quantity <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity',
        text: 'Please enter a valid quantity to transfer',
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    if (transferData.quantity > selectedItem.stockQty) {
      Swal.fire({
        icon: 'warning',
        title: 'Insufficient Stock',
        text: `Cannot transfer ${transferData.quantity} units. Available: ${selectedItem.stockQty} units`,
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    // Confirm transfer
    const result = await Swal.fire({
      title: 'Confirm Transfer?',
      html: `
        <div class="text-left space-y-3">
          <p class="text-gray-700">You are about to transfer:</p>
          <div class="bg-blue-50 p-3 rounded">
            <p class="font-semibold text-gray-900">${selectedItem.productName}</p>
            <p class="text-sm text-gray-600">Quantity: <strong>${transferData.quantity} units</strong></p>
            <p class="text-xs text-gray-500">Available: ${selectedItem.stockQty} units</p>
          </div>
          <div class="flex items-center justify-center gap-3 my-3">
            <span class="px-3 py-1 bg-red-100 text-red-700 rounded font-medium">${transferData.sourceWarehouse}</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
            <span class="px-3 py-1 bg-green-100 text-green-700 rounded font-medium">${transferData.destinationWarehouse}</span>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
            <p class="text-sm text-yellow-800 font-semibold">⚠️ Important:</p>
            <p class="text-sm text-yellow-700">${transferData.quantity} units will be moved to the destination warehouse.</p>
            <p class="text-sm text-yellow-700">Remaining in source: ${selectedItem.stockQty - transferData.quantity} units</p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Transfer',
      cancelButtonText: 'Cancel'
    })

    if (!result.isConfirmed) return

    try {
      // Use the stock transfer API endpoint which handles partial transfers properly
      await axios.post(`${API_URL}/stock-transfers`, {
        productId: selectedItem.productId,
        productName: selectedItem.productName,
        sourceWarehouse: transferData.sourceWarehouse,
        destinationWarehouse: transferData.destinationWarehouse,
        quantity: transferData.quantity,
        status: 'Completed'
      })

      Swal.fire({
        icon: 'success',
        title: 'Success',
        html: `
          <div class="text-center">
            <p class="text-gray-700 mb-2">Successfully transferred ${transferData.quantity} units</p>
            <p class="text-sm text-gray-600">${selectedItem.productName} moved from <strong>${transferData.sourceWarehouse}</strong> to <strong>${transferData.destinationWarehouse}</strong></p>
            <p class="text-xs text-gray-500 mt-2">Remaining in ${transferData.sourceWarehouse}: ${selectedItem.stockQty - transferData.quantity} units</p>
          </div>
        `,
        confirmButtonColor: '#3B82F6',
        timer: 3000
      })

      setTransferModalOpen(false)
      fetchAllData()
    } catch (error) {
      console.error('Error transferring stock:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to transfer stock',
        confirmButtonColor: '#3B82F6'
      })
    }
  }

  const handleViewHistory = () => {
    setHistoryModalOpen(true)
  }

  // Refresh warehouses function (available for future use)
  // const refreshWarehouses = async () => {
  //   setWarehousesLoading(true)
  //   try {
  //     const response = await axios.get(`${API_URL}/warehouses`)
  //     setWarehouses(response.data)
  //   } catch (error) {
  //     console.error('Error refreshing warehouses:', error)
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Failed to refresh warehouses',
  //       confirmButtonColor: '#3B82F6'
  //     })
  //   } finally {
  //     setWarehousesLoading(false)
  //   }
  // }

  // Get unique warehouses from inventory
  const warehouseOptions = [...new Set(inventory.map(item => item.location).filter(Boolean))]

  // Filter configuration
  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by product name or ID...',
      span: 2
    },
    {
      key: 'warehouse',
      label: 'Current Warehouse',
      type: 'select',
      options: [
        { value: '', label: 'All Warehouses' },
        ...warehouseOptions.map(wh => ({ value: wh, label: wh }))
      ]
    }
  ]

  // Table columns
  const columns = [
    {
      accessorKey: 'productName',
      header: 'Product Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.original.productName}</div>
            <div className="text-xs text-gray-500 font-mono">{row.original.productId}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'location',
      header: 'Current Warehouse',
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
          {row.original.location || 'Not assigned'}
        </span>
      )
    },
    {
      accessorKey: 'stockQty',
      header: 'Stock Quantity',
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className={`font-bold text-lg ${
            row.original.stockQty > 50 ? 'text-green-600' :
            row.original.stockQty > 10 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {row.original.stockQty || 0}
          </span>
          <span className="text-gray-500 ml-2">units</span>
        </div>
      )
    },
    {
      accessorKey: 'batch',
      header: 'Batch',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 font-mono">
          {row.original.batch || '-'}
        </span>
      )
    }
  ]

  // Render row actions
  const renderRowActions = (item) => (
    <Button
      variant="primary"
      size="sm"
      onClick={() => handleOpenTransferModal(item)}
      disabled={!item.stockQty || item.stockQty <= 0 || !item.location}
      title="Transfer to Another Warehouse"
    >
      <div className="flex items-center">
        <ArrowRightLeft className="w-4 h-4 mr-1" />
        Transfer
      </div>
    </Button>
  )

  // Transfer history columns
  const historyColumns = [
    {
      accessorKey: 'productName',
      header: 'Product',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.productName}</div>
          <div className="text-xs text-gray-500">{row.original.productId}</div>
        </div>
      )
    },
    {
      accessorKey: 'sourceWarehouse',
      header: 'From',
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
          {row.original.sourceWarehouse}
        </span>
      )
    },
    {
      accessorKey: 'destinationWarehouse',
      header: 'To',
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
          {row.original.destinationWarehouse}
        </span>
      )
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => (
        <span className="font-bold text-blue-600">{row.original.quantity}</span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center w-fit">
          <CheckCircle className="w-3 h-3 mr-1" />
          {row.original.status || 'Completed'}
        </span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {new Date(row.original.createdAt).toLocaleString()}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <ArrowRightLeft className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
              Stock Transfer Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Move inventory between warehouse locations efficiently
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={fetchAllData}
              disabled={loading}
              loading={loading}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Refresh</span>
              </div>
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleViewHistory}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <div className="flex items-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">View History</span>
              </div>
            </Button>
          </div>
        </div>
      </div>


      {/* Info Card */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-900">How Stock Transfer Works</p>
          <div className="text-sm text-blue-700 mt-2 space-y-1">
            <p>• Select a product from the list below</p>
            <p>• Specify the quantity you want to transfer (partial transfers are supported)</p>
            <p>• Choose the destination warehouse</p>
            <p>• The remaining stock stays in the source warehouse</p>
            <p>• All transfers are tracked in the transfer history</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Products in Stock"
          value={inventory.filter(item => item.stockQty > 0).length}
          icon={Package}
          color="blue"
        />
        <StatsCard
          label="Total Stock Units"
          value={inventory.reduce((sum, item) => sum + (item.stockQty || 0), 0)}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          label="Active Warehouses"
          value={warehouseOptions.length}
          icon={Warehouse}
          color="purple"
        />
        <StatsCard
          label="Transfers Made"
          value={transfers.length}
          icon={ArrowRightLeft}
          color="yellow"
        />
      </div>

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Search & Filter Stock"
        resultsCount={filteredInventory.length}
        totalCount={inventory.filter(item => item.stockQty > 0).length}
        showExport={true}
      />

      {/* Stock Transfer Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <SharedTable
          columns={columns}
          data={filteredInventory}
          pageSize={10}
          loading={loading}
          renderRowActions={renderRowActions}
          actionsHeader="Actions"
        />
      </div>

      {/* Transfer Modal */}
      <SharedModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="Transfer Stock Between Warehouses"
        size="large"
      >
        {selectedItem && (
          <form onSubmit={handleTransferSubmit} className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Product Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Product Name</p>
                  <p className="font-semibold text-gray-900">{selectedItem.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Product ID</p>
                  <p className="font-mono text-sm text-gray-700">{selectedItem.productId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Location</p>
                  <p className="font-semibold text-blue-700">{selectedItem.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Stock</p>
                  <p className="font-bold text-2xl text-green-600">{selectedItem.stockQty} units</p>
                </div>
                {selectedItem.batch && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Batch Number</p>
                    <p className="font-mono text-sm text-gray-700">{selectedItem.batch}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Transfer Form Fields */}
            <div className="grid grid-cols-1 gap-6">
              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transfer Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedItem.stockQty}
                  value={transferData.quantity}
                  onChange={(e) => setTransferData({ ...transferData, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-bold text-lg"
                  placeholder={`Enter quantity (max: ${selectedItem.stockQty})`}
                  required
                />
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-600">
                    Available: <strong className="text-green-600">{selectedItem.stockQty} units</strong>
                  </p>
                  {transferData.quantity > 0 && (
                    <p className="text-xs text-gray-600">
                      Remaining: <strong className={selectedItem.stockQty - transferData.quantity >= 10 ? 'text-green-600' : 'text-red-600'}>
                        {selectedItem.stockQty - transferData.quantity} units
                      </strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Source Warehouse */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From Warehouse
                </label>
                <input
                  type="text"
                  value={transferData.sourceWarehouse}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold text-lg"
                  disabled
                  readOnly
                />
              </div>

              {/* Destination Warehouse */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  value={transferData.destinationWarehouse}
                  onChange={(e) => setTransferData({ ...transferData, destinationWarehouse: e.target.value })}
                  disabled={warehousesLoading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium text-lg"
                  required
                >
                  <option value="">
                    {warehousesLoading ? 'Loading warehouses...' : 'Select destination warehouse'}
                  </option>
                  {warehouses.length > 0 ? (
                    warehouses
                      .filter(wh => wh.name !== selectedItem.location)
                      .map(wh => (
                        <option key={wh._id} value={wh.name}>
                          {wh.name} {wh.location ? `- ${wh.location}` : ''}
                        </option>
                      ))
                  ) : (
                    !warehousesLoading && (
                      <option value="" disabled>
                        No warehouses available
                      </option>
                    )
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {warehousesLoading 
                    ? 'Loading available warehouses...' 
                    : warehouses.length > 0 
                      ? `${warehouses.filter(wh => wh.name !== selectedItem.location).length} destination(s) available`
                      : 'No warehouses available - please add warehouses first'
                  }
                </p>
              </div>
            </div>

            {/* Transfer Preview */}
            {transferData.destinationWarehouse && transferData.quantity > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                <h4 className="font-bold text-green-900 mb-4 flex items-center text-lg">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Transfer Preview
                </h4>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <p className="text-gray-700 font-semibold mb-2">{transferData.sourceWarehouse}</p>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                      <p className="font-bold text-2xl text-gray-900">{selectedItem.stockQty}</p>
                      <p className="text-sm text-red-600 font-semibold mt-2">
                        After: {selectedItem.stockQty - transferData.quantity} units
                      </p>
                    </div>
                  </div>
                  
                  <div className="mx-6 flex flex-col items-center">
                    <ArrowRightLeft className="w-10 h-10 text-green-600 animate-pulse" />
                    <p className="text-sm font-bold text-green-700 mt-2">
                      {transferData.quantity} units
                    </p>
                  </div>
                  
                  <div className="text-center flex-1">
                    <p className="text-gray-700 font-semibold mb-2">{transferData.destinationWarehouse}</p>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Will Receive</p>
                      <p className="font-bold text-2xl text-green-600">+{transferData.quantity}</p>
                      <p className="text-sm text-green-600 font-semibold mt-2">
                        New stock added
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Alert */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">Transfer Information</p>
                <p className="text-sm text-blue-700 mt-1">
                  The transfer will move the specified quantity from the source warehouse to the destination warehouse. This action is tracked in the transfer history.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => setTransferModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                disabled={!transferData.destinationWarehouse || !transferData.quantity || transferData.quantity <= 0}
              >
                <div className="flex items-center">
                  <ArrowRightLeft className="w-5 h-5 mr-2" />
                  Confirm Transfer
                </div>
              </Button>
            </div>
          </form>
        )}
      </SharedModal>

      {/* History Modal */}
      <SharedModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title="Transfer History"
        size="large"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Complete history of all stock transfers between warehouses
          </p>
          <SharedTable
            columns={historyColumns}
            data={transfers}
            pageSize={10}
            loading={false}
          />
        </div>
      </SharedModal>
    </div>
  )
}

export default WarehouseStocktransfer
