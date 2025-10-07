import React, { useState, useEffect, useCallback } from 'react'
import { QrCode, Barcode, Plus, RefreshCw, Download, AlertCircle, Package, CheckCircle2, XCircle } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { ReuseableFilter } from '../../Shared/ReuseableFilter/ReuseableFilter'
import SharedModal from '../../Shared/SharedModal/SharedModal'
import axios from 'axios'

const API_URL = 'https://pos-system-management-server-20.vercel.app'

const WarehouseBarcode = () => {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  const [formData, setFormData] = useState({
    barcode: '',
    qrCode: '',
    autoGenerate: true
  })

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    warehouse: '',
    barcodeStatus: ''
  })

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/inventory`)
      setInventory(response.data)
    } catch (error) {
      console.error('Error fetching inventory:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch inventory',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setLoading(false)
    }
  }

  // Generate unique barcode/QR code
  const generateCode = (prefix = 'QR') => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `${prefix}-${timestamp}-${random}`
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
        item.sku?.toLowerCase().includes(searchLower) ||
        item.barcode?.toLowerCase().includes(searchLower) ||
        item.qrCode?.toLowerCase().includes(searchLower)
      )
    }

    // Warehouse filter
    if (filters.warehouse) {
      filtered = filtered.filter(item => item.location === filters.warehouse)
    }

    // Barcode Status filter
    if (filters.barcodeStatus === 'assigned') {
      filtered = filtered.filter(item => item.barcode || item.qrCode)
    } else if (filters.barcodeStatus === 'unassigned') {
      filtered = filtered.filter(item => !item.barcode && !item.qrCode)
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
    setFilters({ search: '', warehouse: '', barcodeStatus: '' })
  }

  const handleExport = () => {
    const csv = [
      ['Product Name', 'SKU', 'Barcode', 'QR Code', 'Warehouse', 'Stock Qty'],
      ...filteredInventory.map(item => [
        item.productName,
        item.sku || item.productId,
        item.barcode || '',
        item.qrCode || '',
        item.location || '',
        item.stockQty || 0
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `barcodes-${Date.now()}.csv`
    a.click()
  }

  const handleOpenModal = (item) => {
    setSelectedItem(item)
    setFormData({
      barcode: item.barcode || '',
      qrCode: item.qrCode || '',
      autoGenerate: !item.barcode && !item.qrCode
    })
    setModalOpen(true)
  }

  const handleAutoGenerate = () => {
    if (formData.autoGenerate) {
      setFormData({
        ...formData,
        barcode: generateCode('BAR'),
        qrCode: generateCode('QR')
      })
    }
  }

  useEffect(() => {
    if (modalOpen && formData.autoGenerate && !formData.barcode && !formData.qrCode) {
      handleAutoGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, formData.autoGenerate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.barcode && !formData.qrCode) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter at least a barcode or QR code',
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    try {
      await axios.patch(`${API_URL}/inventory/${selectedItem._id}/barcode`, {
        barcode: formData.barcode || undefined,
        qrCode: formData.qrCode || undefined
      })

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Barcode/QR code assigned successfully',
        confirmButtonColor: '#3B82F6',
        timer: 2000
      })

      setModalOpen(false)
      fetchInventory()
    } catch (error) {
      console.error('Error assigning barcode:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to assign barcode/QR code',
        confirmButtonColor: '#3B82F6'
      })
    }
  }

  const handlePrintQR = (item) => {
    // Create a simple QR code display for printing
    const qrData = item.qrCode || item.barcode || item.productId
    const printContent = `
      <html>
        <head>
          <title>QR Code - ${item.productName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .qr-container {
              border: 2px solid #333;
              padding: 20px;
              display: inline-block;
              margin: 20px;
            }
            .product-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .qr-code {
              font-size: 24px;
              font-family: monospace;
              margin: 10px 0;
            }
            .info {
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="product-name">${item.productName}</div>
            <div class="qr-code">${qrData}</div>
            <div class="info">SKU: ${item.sku || item.productId}</div>
            <div class="info">Location: ${item.location || 'N/A'}</div>
          </div>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '', 'width=600,height=600')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  // Get unique warehouses
  const warehouseOptions = [...new Set(inventory.map(item => item.location).filter(Boolean))]

  // Filter configuration
  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by product name, SKU, barcode, or QR...',
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
      key: 'barcodeStatus',
      label: 'Barcode Status',
      type: 'select',
      options: [
        { value: '', label: 'All Status' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'unassigned', label: 'Unassigned' }
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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-3">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.original.productName}</div>
            <div className="text-xs text-gray-500 font-mono">{row.original.sku || row.original.productId}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'barcode',
      header: 'Current Barcode',
      cell: ({ row }) => (
        row.original.barcode ? (
          <div className="flex items-center">
            <Barcode className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-mono text-sm text-gray-700">{row.original.barcode}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Not assigned</span>
        )
      )
    },
    {
      accessorKey: 'qrCode',
      header: 'Current QR Code',
      cell: ({ row }) => (
        row.original.qrCode ? (
          <div className="flex items-center">
            <QrCode className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-mono text-sm text-gray-700">{row.original.qrCode}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Not assigned</span>
        )
      )
    },
    {
      accessorKey: 'stockQty',
      header: 'Quantity',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900">{row.original.stockQty || 0}</span>
      )
    },
    {
      accessorKey: 'location',
      header: 'Warehouse',
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
          {row.original.location || 'N/A'}
        </span>
      )
    }
  ]

  // Render row actions
  const renderRowActions = (item) => (
    <div className="flex items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleOpenModal(item)}
        title="Assign/Regenerate"
      >
        <div className="flex items-center">
          {item.barcode || item.qrCode ? (
            <>
              <RefreshCw className="w-4 h-4 mr-1" />
              Regenerate
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" />
              Assign
            </>
          )}
        </div>
      </Button>
      {(item.barcode || item.qrCode) && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePrintQR(item)}
          title="Print QR/Barcode"
        >
          <div className="flex items-center">
            <Download className="w-4 h-4 mr-1" />
            Print
          </div>
        </Button>
      )}
    </div>
  )

  // Calculate stats
  const assignedCount = inventory.filter(item => item.barcode || item.qrCode).length
  const unassignedCount = inventory.length - assignedCount

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <QrCode className="w-8 h-8 mr-3 text-cyan-600" />
              Barcode / QR Code Assignment
            </h1>
            <p className="text-gray-600 mt-2">
              Assign unique barcodes and QR codes to stock items
            </p>

            
          </div>

          <Button 
            variant="secondary" 
            size="md"
            onClick={fetchInventory}
            loading={loading}
          >
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </div>
          </Button>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Auto-Generation Available</p>
          <p className="text-sm text-blue-700 mt-1">
            System can automatically generate unique barcodes and QR codes for your inventory items.
            You can also manually enter custom codes if needed.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Total Products"
          value={inventory.length}
          icon={Package}
          color="gray"
        />
        <StatsCard
          label="Assigned Codes"
          value={assignedCount}
          icon={CheckCircle2}
          color="green"
        />
        <StatsCard
          label="Unassigned"
          value={unassignedCount}
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
        title="Search & Filter Products"
        resultsCount={filteredInventory.length}
        totalCount={inventory.length}
      />

      {/* Product Table */}
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

      {/* Assign/Regenerate Modal */}
      <SharedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedItem?.barcode || selectedItem?.qrCode ? 'Regenerate Barcode/QR Code' : 'Assign Barcode/QR Code'}
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
                <span className="font-medium">SKU:</span> {selectedItem.sku || selectedItem.productId}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Location:</span> {selectedItem.location}
              </p>
            </div>

            {/* Auto-generate toggle */}
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">Auto-generate codes</p>
                <p className="text-xs text-blue-700">Let system create unique codes automatically</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoGenerate}
                  onChange={(e) => {
                    const isChecked = e.target.checked
                    if (isChecked) {
                      setFormData({
                        barcode: generateCode('BAR'),
                        qrCode: generateCode('QR'),
                        autoGenerate: true
                      })
                    } else {
                      setFormData({
                        ...formData,
                        autoGenerate: false
                      })
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Barcode Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode
              </label>
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value, autoGenerate: false })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono"
                  placeholder="Enter or auto-generate barcode"
                  readOnly={formData.autoGenerate}
                />
              </div>
            </div>

            {/* QR Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code
              </label>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.qrCode}
                  onChange={(e) => setFormData({ ...formData, qrCode: e.target.value, autoGenerate: false })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono"
                  placeholder="Enter or auto-generate QR code"
                  readOnly={formData.autoGenerate}
                />
              </div>
            </div>

            {/* Preview */}
            {(formData.barcode || formData.qrCode) && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Preview
                </h4>
                {formData.barcode && (
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Barcode:</span> <span className="font-mono">{formData.barcode}</span>
                  </p>
                )}
                {formData.qrCode && (
                  <p className="text-sm text-green-800">
                    <span className="font-medium">QR Code:</span> <span className="font-mono">{formData.qrCode}</span>
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
                {selectedItem.barcode || selectedItem.qrCode ? 'Update' : 'Assign'} Code
              </Button>
            </div>
          </form>
        )}
      </SharedModal>
    </div>
  )
}

export default WarehouseBarcode
