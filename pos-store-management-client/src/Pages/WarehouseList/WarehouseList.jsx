import React, { useState, useEffect, useCallback } from 'react'
import { Warehouse, Plus, Pencil, Trash2, Eye, Package, MapPin, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { ReuseableFilter } from '../../Shared/ReuseableFilter/ReuseableFilter'
import SharedModal from '../../Shared/SharedModal/SharedModal'
import axios from 'axios'

const API_URL = 'https://pos-system-management-server-20.vercel.app'

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([])
  const [filteredWarehouses, setFilteredWarehouses] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: ''
  })

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    location: ''
  })

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/warehouses`)
      setWarehouses(response.data)
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch warehouses',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...warehouses]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(warehouse => 
        warehouse.name?.toLowerCase().includes(searchLower) ||
        warehouse.location?.toLowerCase().includes(searchLower) ||
        warehouse.contactPerson?.toLowerCase().includes(searchLower)
      )
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(warehouse => 
        warehouse.location?.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    setFilteredWarehouses(filtered)
  }, [warehouses, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', location: '' })
  }

  const handleExport = () => {
    const csv = [
      ['Warehouse Name', 'Location', 'Address', 'Contact Person', 'Phone', 'Email', 'Total Products', 'Total Stock'],
      ...filteredWarehouses.map(w => [
        w.name,
        w.location || '',
        w.address || '',
        w.contactPerson || '',
        w.phone || '',
        w.email || '',
        w.totalProducts || 0,
        w.totalStock || 0
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `warehouses-${Date.now()}.csv`
    a.click()
  }

  const handleOpenAddModal = () => {
    setEditMode(false)
    setFormData({
      name: '',
      location: '',
      address: '',
      contactPerson: '',
      phone: '',
      email: ''
    })
    setModalOpen(true)
  }

  const handleOpenEditModal = (warehouse) => {
    setEditMode(true)
    setSelectedWarehouse(warehouse)
    setFormData({
      name: warehouse.name || '',
      location: warehouse.location || '',
      address: warehouse.address || '',
      contactPerson: warehouse.contactPerson || '',
      phone: warehouse.phone || '',
      email: warehouse.email || ''
    })
    setModalOpen(true)
  }

  const handleView = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setViewModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.location) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in warehouse name and location',
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    try {
      if (editMode) {
        await axios.put(`${API_URL}/warehouses/${selectedWarehouse._id}`, formData)
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Warehouse updated successfully',
          confirmButtonColor: '#3B82F6',
          timer: 2000
        })
      } else {
        await axios.post(`${API_URL}/warehouses`, formData)
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Warehouse created successfully',
          confirmButtonColor: '#3B82F6',
          timer: 2000
        })
      }
      
      setModalOpen(false)
      fetchWarehouses()
    } catch (error) {
      console.error('Error saving warehouse:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save warehouse',
        confirmButtonColor: '#3B82F6'
      })
    }
  }

  const handleDelete = async (warehouse) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete warehouse "${warehouse.name}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/warehouses/${warehouse._id}`)
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Warehouse deleted successfully',
          confirmButtonColor: '#3B82F6',
          timer: 2000
        })
        fetchWarehouses()
      } catch (error) {
        console.error('Error deleting warehouse:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete warehouse',
          confirmButtonColor: '#3B82F6'
        })
      }
    }
  }

  // Get unique locations for filter
  const locations = [...new Set(warehouses.map(w => w.location).filter(Boolean))]

  // Filter configuration
  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by name, location, or contact...',
      span: 2
    },
    {
      key: 'location',
      label: 'Location',
      type: 'select',
      options: [
        { value: '', label: 'All Locations' },
        ...locations.map(loc => ({ value: loc, label: loc }))
      ]
    }
  ]

  // Table columns
  const columns = [
    {
      accessorKey: 'name',
      header: 'Warehouse Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
            <Warehouse className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.original.name}</div>
            <div className="text-xs text-gray-500">{row.original.location}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => (
        <div className="flex items-center text-sm text-gray-700">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          {row.original.address || '-'}
        </div>
      )
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.original.contactPerson || '-'}</div>
          {row.original.phone && <div className="text-xs text-gray-500">{row.original.phone}</div>}
        </div>
      )
    },
    {
      accessorKey: 'totalProducts',
      header: 'Total Products',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 mr-2 text-blue-500" />
          <span className="font-semibold text-gray-900">{row.original.totalProducts || 0}</span>
        </div>
      )
    },
    {
      accessorKey: 'totalStock',
      header: 'Total Stock Qty',
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
          {row.original.totalStock || 0} units
        </span>
      )
    }
  ]

  // Render row actions
  const renderRowActions = (warehouse) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleView(warehouse)}
        title="View Details"
      >
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          View
        </div>
      </Button>
      <Button
        variant="edit"
        size="sm"
        onClick={() => handleOpenEditModal(warehouse)}
        title="Edit"
      >
        <div className="flex items-center">
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </div>
      </Button>
      <Button
        variant="delete"
        size="sm"
        onClick={() => handleDelete(warehouse)}
        title="Delete"
      >
        <div className="flex items-center">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </div>
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Warehouse className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
              Warehouse Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Manage warehouse locations and view stock summaries
            </p>
          </div>

          <Button 
            variant="primary" 
            size="sm"
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto flex items-center justify-center"
          >
            <div className="flex items-center">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Add Warehouse</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Warehouse Management Overview
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Manage your warehouse locations, track inventory levels, and monitor stock distribution across different facilities. 
                Add new warehouses, update contact information, and view detailed stock summaries for each location.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <StatsCard
          title="Total Warehouses"
          value={warehouses.length}
          icon={Warehouse}
          color="blue"
          trend={null}
        />
        <StatsCard
          title="Total Products"
          value={warehouses.reduce((sum, w) => sum + (w.totalProducts || 0), 0)}
          icon={Package}
          color="purple"
          trend={null}
        />
        <StatsCard
          title="Total Stock"
          value={warehouses.reduce((sum, w) => sum + (w.totalStock || 0), 0)}
          icon={Package}
          color="green"
          trend={null}
        />
        <StatsCard
          title="Active Locations"
          value={warehouses.filter(w => w.location).length}
          icon={MapPin}
          color="orange"
          trend={null}
        />
        <StatsCard
          title="Avg Products/Warehouse"
          value={warehouses.length > 0 ? Math.round(warehouses.reduce((sum, w) => sum + (w.totalProducts || 0), 0) / warehouses.length) : 0}
          icon={Package}
          color="indigo"
          trend={null}
        />
      </div>

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Search & Filter Warehouses"
        resultsCount={filteredWarehouses.length}
        totalCount={warehouses.length}
      />

      {/* Warehouse Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <SharedTable
          columns={columns}
          data={filteredWarehouses}
          pageSize={10}
          loading={loading}
          renderRowActions={renderRowActions}
          actionsHeader="Actions"
        />
      </div>

      {/* Add/Edit Modal */}
      <SharedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? 'Edit Warehouse' : 'Add New Warehouse'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warehouse Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Main Warehouse"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location / City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Dhaka"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full address"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Manager name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editMode ? 'Update' : 'Create'} Warehouse
            </Button>
          </div>
        </form>
      </SharedModal>

      {/* View Modal */}
      <SharedModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Warehouse Details"
        size="medium"
      >
        {selectedWarehouse && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Warehouse Name</p>
                <p className="text-base font-semibold text-gray-900">{selectedWarehouse.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-base font-semibold text-gray-900">{selectedWarehouse.location}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-base text-gray-900">{selectedWarehouse.address || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Person</p>
                <p className="text-base text-gray-900">{selectedWarehouse.contactPerson || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-base text-gray-900">{selectedWarehouse.phone || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-900">{selectedWarehouse.email || '-'}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Stock Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Products</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedWarehouse.totalProducts || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Total Stock Quantity</p>
                  <p className="text-2xl font-bold text-green-900">{selectedWarehouse.totalStock || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SharedModal>
    </div>
  )
}

export default WarehouseList
