import React, { useState, useEffect, useCallback } from 'react'
import { Package, Plus, Pencil, AlertTriangle, Calendar, Clock, Info, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { ReuseableFilter } from '../../Shared/ReuseableFilter/ReuseableFilter'
import SharedModal from '../../Shared/SharedModal/SharedModal'
import axios from 'axios'

const API_URL = 'https://pos-system-management-server-20.vercel.app'

const WarehouseBatchtracking = () => {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  const [formData, setFormData] = useState({
    batch: '',
    expiry: ''
  })

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    warehouse: '',
    expiryStatus: ''
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [invResponse, productResponse] = await Promise.all([
        axios.get(`${API_URL}/inventory`),
        axios.get(`${API_URL}/products`)
      ])
      setInventory(invResponse.data)
      setProducts(productResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch data',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate expiry status
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return 'unknown'
    
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 30) return 'near-expiry'
    return 'valid'
  }

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...inventory]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(item => 
        item.productName?.toLowerCase().includes(searchLower) ||
        item.productId?.toLowerCase().includes(searchLower) ||
        item.batch?.toLowerCase().includes(searchLower)
      )
    }

    // Warehouse filter
    if (filters.warehouse) {
      filtered = filtered.filter(item => item.location === filters.warehouse)
    }

    // Expiry Status filter
    if (filters.expiryStatus) {
      filtered = filtered.filter(item => getExpiryStatus(item.expiry) === filters.expiryStatus)
    }

    setFilteredInventory(filtered)
  }, [inventory, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', warehouse: '', expiryStatus: '' })
  }

  const handleExport = () => {
    const csv = [
      ['Product Name', 'Batch Number', 'Expiry Date', 'Quantity', 'Warehouse', 'Status'],
      ...filteredInventory.map(item => [
        item.productName,
        item.batch || 'N/A',
        item.expiry ? new Date(item.expiry).toLocaleDateString() : 'N/A',
        item.stockQty || 0,
        item.location || 'N/A',
        getExpiryStatus(item.expiry)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `batch-tracking-${Date.now()}.csv`
    a.click()
  }

  const handleOpenEditModal = (item) => {
    setSelectedItem(item)
    setFormData({
      batch: item.batch || '',
      expiry: item.expiry ? new Date(item.expiry).toISOString().split('T')[0] : ''
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.batch && !formData.expiry) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please provide at least batch number or expiry date',
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    try {
      // Update inventory record directly
      await axios.put(`${API_URL}/inventory/${selectedItem._id}`, {
        ...selectedItem,
        batch: formData.batch || null,
        expiry: formData.expiry || null
      })

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Batch information updated successfully',
        confirmButtonColor: '#3B82F6',
        timer: 2000
      })
      
      setModalOpen(false)
      fetchAllData()
    } catch (error) {
      console.error('Error updating batch:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update batch information',
        confirmButtonColor: '#3B82F6'
      })
    }
  }

  // Get unique warehouses
  const warehouseOptions = [...new Set(inventory.map(item => item.location).filter(Boolean))]

  // Filter configuration
  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by product name or batch number...',
      span: 2
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      options: [
        { value: '', label: 'All Warehouses' },
        ...warehouseOptions.map(wh => ({ value: wh, label: wh }))
      ]
    },
    {
      key: 'expiryStatus',
      label: 'Expiry Status',
      type: 'select',
      options: [
        { value: '', label: 'All Status' },
        { value: 'expired', label: 'Expired' },
        { value: 'near-expiry', label: 'Near Expiry (≤30 days)' },
        { value: 'valid', label: 'Valid (>30 days)' },
        { value: 'unknown', label: 'No Expiry Date' }
      ]
    }
  ]

  // Table columns
  const columns = [
    {
      accessorKey: 'productName',
      header: 'Product Name',
      cell: ({ row }) => {
        const product = products.find(p => p._id === row.original.productId)
        return (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mr-3">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{row.original.productName}</div>
              <div className="text-xs text-gray-500">{product?.category || 'N/A'}</div>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'batch',
      header: 'Batch Number',
      cell: ({ row }) => (
        row.original.batch ? (
          <span className="font-mono font-semibold text-blue-600">{row.original.batch}</span>
        ) : (
          <span className="text-gray-400 text-sm italic">Not assigned</span>
        )
      )
    },
    {
      accessorKey: 'expiry',
      header: 'Expiry Date',
      cell: ({ row }) => {
        const status = getExpiryStatus(row.original.expiry)
        const date = row.original.expiry ? new Date(row.original.expiry) : null
        
        return (
          <div className="flex items-center">
            <Calendar className={`w-4 h-4 mr-2 ${
              status === 'expired' ? 'text-red-500' :
              status === 'near-expiry' ? 'text-yellow-500' :
              status === 'valid' ? 'text-green-500' :
              'text-gray-400'
            }`} />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {date ? date.toLocaleDateString() : 'Not set'}
              </div>
              {date && (
                <div className={`text-xs ${
                  status === 'expired' ? 'text-red-600' :
                  status === 'near-expiry' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {status === 'expired' ? 'Expired' :
                   status === 'near-expiry' ? `${Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24))} days left` :
                   'Valid'}
                </div>
              )}
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'stockQty',
      header: 'Quantity',
      cell: ({ row }) => (
        <span className="font-bold text-lg text-gray-900">{row.original.stockQty || 0}</span>
      )
    },
    {
      accessorKey: 'location',
      header: 'Warehouse',
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
          {row.original.location || 'Not assigned'}
        </span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = getExpiryStatus(row.original.expiry)
        
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center w-fit ${
            status === 'expired' ? 'bg-red-100 text-red-800 border border-red-200' :
            status === 'near-expiry' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
            status === 'valid' ? 'bg-green-100 text-green-800 border border-green-200' :
            'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
            {status === 'expired' ? (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" />
                Expired
              </>
            ) : status === 'near-expiry' ? (
              <>
                <Clock className="w-3 h-3 mr-1" />
                Near Expiry
              </>
            ) : status === 'valid' ? (
              '✓ Valid'
            ) : (
              'No expiry'
            )}
          </span>
        )
      }
    }
  ]

  // Render row actions
  const renderRowActions = (item) => (
    <Button
      variant="edit"
      size="sm"
      onClick={() => handleOpenEditModal(item)}
      title="Edit Batch Info"
    >
      <div className="flex items-center">
        <Pencil className="w-4 h-4 mr-1" />
        Edit Batch
      </div>
    </Button>
  )

  // Calculate stats
  const expiredCount = inventory.filter(item => getExpiryStatus(item.expiry) === 'expired').length
  const nearExpiryCount = inventory.filter(item => getExpiryStatus(item.expiry) === 'near-expiry').length
  const withBatchCount = inventory.filter(item => item.batch).length

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-green-600" />
              Batch & Expiry Tracking
            </h1>
            <p className="text-gray-600 mt-2">
              Track batch numbers and expiry dates for inventory items
            </p>
          </div>
          
          <Button 
            variant="secondary" 
            size="md"
            onClick={fetchAllData}
            loading={loading}
          >
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </div>
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">How Batch Tracking Works</p>
          <p className="text-sm text-blue-700 mt-1">
            Each inventory item stores batch number and expiry date. Click "Edit Batch" on any item to update its batch information.
            Batch data comes from GRN entries but can be updated here anytime.
          </p>
        </div>
      </div>

      {/* Alert for expired/near-expiry items */}
      {(expiredCount > 0 || nearExpiryCount > 0) && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-900">Attention Required</p>
            <p className="text-sm text-yellow-700 mt-1">
              {expiredCount > 0 && `${expiredCount} item${expiredCount > 1 ? 's' : ''} expired. `}
              {nearExpiryCount > 0 && `${nearExpiryCount} item${nearExpiryCount > 1 ? 's' : ''} expiring within 30 days.`}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          label="Total Items"
          value={inventory.length}
          icon={Package}
          color="gray"
        />
        <StatsCard
          label="With Batch Info"
          value={withBatchCount}
          icon={CheckCircle}
          color="blue"
        />
        <StatsCard
          label="Valid"
          value={inventory.filter(item => getExpiryStatus(item.expiry) === 'valid').length}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          label="Near Expiry"
          value={nearExpiryCount}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          label="Expired"
          value={expiredCount}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Search & Filter Inventory"
        resultsCount={filteredInventory.length}
        totalCount={inventory.length}
      />

      {/* Inventory Table */}
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

      {/* Edit Batch Modal */}
      <SharedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Batch Information"
        size="medium"
      >
        {selectedItem && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Name:</span> {selectedItem.productName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Current Stock:</span> {selectedItem.stockQty} units
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Location:</span> {selectedItem.location || 'Not assigned'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number
              </label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., BATCH-2024-001"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to remove batch number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to remove expiry date
              </p>
            </div>

            {/* Preview */}
            {(formData.batch || formData.expiry) && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Preview
                </h4>
                {formData.batch && (
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Batch:</span> {formData.batch}
                  </p>
                )}
                {formData.expiry && (
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Expiry:</span> {new Date(formData.expiry).toLocaleDateString()}
                    <span className={`ml-2 font-semibold ${
                      getExpiryStatus(formData.expiry) === 'expired' ? 'text-red-600' :
                      getExpiryStatus(formData.expiry) === 'near-expiry' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      ({getExpiryStatus(formData.expiry) === 'expired' ? 'Expired' :
                        getExpiryStatus(formData.expiry) === 'near-expiry' ? 'Expiring Soon' :
                        'Valid'})
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Batch Info
              </Button>
            </div>
          </form>
        )}
      </SharedModal>
    </div>
  )
}

export default WarehouseBatchtracking
