import React, { useState, useEffect, useCallback } from 'react'
import { ArrowRightLeft, Search, Package, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
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
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ArrowRightLeft className="w-8 h-8 mr-3 text-purple-600" />
              Stock Transfer
            </h1>
            <p className="text-gray-600 mt-2">
              Move inventory between warehouse locations
            </p>

            {/* Important Info Alert */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Flexible Transfer System</p>
                <p className="text-sm text-blue-700 mt-1">
                  You can now transfer partial quantities between warehouses. Specify the exact amount you want to move,
                  and the remaining stock will stay in the source warehouse. This allows for better inventory distribution.
                </p>
              </div>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Transfer Instructions</p>
                <p className="text-sm text-blue-700 mt-1">
                  Select a product from the list and click "Transfer" to move it to a different warehouse.
                  A complete transfer history is maintained for audit purposes.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs text-gray-600">Products in Stock</p>
                <p className="text-lg font-bold text-gray-900">
                  {inventory.filter(item => item.stockQty > 0).length}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs text-gray-600">Total Stock Qty</p>
                <p className="text-lg font-bold text-green-600">
                  {inventory.reduce((sum, item) => sum + (item.stockQty || 0), 0)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs text-gray-600">Transfers Made</p>
                <p className="text-lg font-bold text-purple-600">{transfers.length}</p>
              </div>
            </div>
          </div>

          <Button 
            variant="secondary" 
            size="md"
            onClick={handleViewHistory}
          >
            <div className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              View History
            </div>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterConfig={filterConfig}
        title="Search & Filter Stock"
        resultsCount={filteredInventory.length}
        totalCount={inventory.filter(item => item.stockQty > 0).length}
        showExport={false}
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
        title="Transfer Stock"
        size="medium"
      >
        {selectedItem && (
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            {/* Product Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Name:</span> {selectedItem.productName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Current Location:</span> {selectedItem.location || 'Not assigned'}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Stock to Transfer:</span>{' '}
                <span className="font-bold text-green-600">{selectedItem.stockQty} units</span>
              </p>
              {selectedItem.batch && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Batch:</span> {selectedItem.batch}
                </p>
              )}
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max={selectedItem.stockQty}
                value={transferData.quantity}
                onChange={(e) => setTransferData({ ...transferData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder={`Enter quantity (max: ${selectedItem.stockQty})`}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: {selectedItem.stockQty} units
              </p>
            </div>

            {/* Source Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Warehouse <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transferData.sourceWarehouse}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium"
                disabled
                readOnly
              />
            </div>

            {/* Destination Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Warehouse <span className="text-red-500">*</span>
              </label>
              <select
                value={transferData.destinationWarehouse}
                onChange={(e) => setTransferData({ ...transferData, destinationWarehouse: e.target.value })}
                disabled={warehousesLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              <p className="text-xs text-gray-500 mt-1">
                {warehousesLoading 
                  ? 'Loading available warehouses...' 
                  : warehouses.length > 0 
                    ? `Select destination warehouse (${warehouses.filter(wh => wh.name !== selectedItem.location).length} available)`
                    : 'No warehouses available - please add warehouses first'
                }
              </p>
            </div>

            {/* Preview */}
            {transferData.destinationWarehouse && transferData.quantity > 0 && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Transfer Preview</h4>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center flex-1">
                    <p className="text-gray-600 font-medium">{transferData.sourceWarehouse}</p>
                    <p className="font-bold text-red-600 text-lg mt-1">
                      {selectedItem.stockQty} → {selectedItem.stockQty - transferData.quantity}
                    </p>
                    <p className="text-xs text-gray-500">units remaining</p>
                  </div>
                  <ArrowRightLeft className="w-6 h-6 text-green-600 mx-4" />
                  <div className="text-center flex-1">
                    <p className="text-gray-600 font-medium">{transferData.destinationWarehouse}</p>
                    <p className="font-bold text-green-600 text-lg mt-1">
                      +{transferData.quantity}
                    </p>
                    <p className="text-xs text-gray-500">units</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setTransferModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <div className="flex items-center">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
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
