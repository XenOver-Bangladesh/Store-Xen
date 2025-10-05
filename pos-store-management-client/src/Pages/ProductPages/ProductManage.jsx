import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../Components/UI/Button'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { ReuseableFilter } from '../../Shared/ReuseableFilter/ReuseableFilter'
import ViewProductModal from './ViewProductModal'
import EditProductModal from './EditProductModal'
import axios from 'axios'
import Swal from 'sweetalert2'
import { LayoutGrid, List, Eye, Pencil, Trash2 } from 'lucide-react'

const ProductManage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'card'
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: ''
  })

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  const applyFilters = useCallback(() => {
    let filtered = [...products]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(product => 
        product.productName?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.qrCode?.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Supplier filter
    if (filters.supplier) {
      filtered = filtered.filter(product => product.supplier === filters.supplier)
    }

    setFilteredProducts(filtered)
  }, [products, filters])

  // Apply filters
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get('https://pos-system-management-server-20.vercel.app/Products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load products',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      supplier: ''
    })
  }

  const handleExport = () => {
    // Export to CSV
    const csv = [
      ['Product Name', 'Category', 'Brand', 'Supplier', 'QR Code', 'Created At'],
      ...filteredProducts.map(p => [
        p.productName,
        p.category,
        p.brand || '',
        p.supplier || '',
        p.qrCode,
        new Date(p.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products-${Date.now()}.csv`
    a.click()
  }

  const handleView = (product) => {
    setSelectedProduct(product)
    setViewModalOpen(true)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${product.productName}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://pos-system-management-server-20.vercel.app/Products/${product._id}`)
        
        await Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          timerProgressBar: true
        })
        
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete product',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        })
      }
    }
  }

  const handleEditSuccess = () => {
    setEditModalOpen(false)
    fetchProducts()
  }

  // Get unique categories and suppliers for filters
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
  const suppliers = [...new Set(products.map(p => p.supplier).filter(Boolean))]

  // Table columns
  const columns = [
    {
      accessorKey: 'productImage',
      header: 'Image',
      cell: ({ row }) => (
        <img 
          src={row.original.productImage || 'https://via.placeholder.com/50'} 
          alt={row.original.productName}
          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
        />
      )
    },
    {
      accessorKey: 'productName',
      header: 'Product Name',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-gray-900">{row.original.productName}</div>
          <div className="text-xs text-gray-500">{row.original.qrCode}</div>
        </div>
      )
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.original.category}
        </span>
      )
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
      cell: ({ row }) => row.original.brand || '-'
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => row.original.supplier || '-'
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
    }
  ]

  // Filter configuration
  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by name, brand, or QR code...',
      span: 2
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: '', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat, label: cat }))
      ]
    },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'select',
      options: [
        { value: '', label: 'All Suppliers' },
        ...suppliers.map(sup => ({ value: sup, label: sup }))
      ]
    }
  ]

  // Render row actions for table
  const renderRowActions = (product) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleView(product)}
      >
        <div className='items-center'>
        <div className='flex items-center'>
        <Eye className="w-4 h-4 mr-1" />
        View
        </div>
        </div>
      </Button>
      <Button
        variant="edit"
        size="sm"
        onClick={() => handleEdit(product)}
      >
        <div className='flex items-center'>
        <Pencil className="w-4 h-4 mr-1" />
        Edit
        </div>
      </Button>
      <Button
        variant="delete"
        size="sm"
        onClick={() => handleDelete(product)}
      >
        <div className='flex items-center'>
        <Trash2 className="w-4 h-4 mr-1" />
        Delete
        </div>
      </Button>
    </div>
  )

  // Card View Component
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {loading ? (
        <div className="col-span-full flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img
                src={product.productImage || 'https://via.placeholder.com/400'}
                alt={product.productName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-lg">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                {product.productName}
              </h3>
              
              <div className="space-y-2 mb-4">
                {product.brand && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                )}
                {product.supplier && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Supplier:</span> {product.supplier}
                  </p>
                )}
                <p className="text-xs text-gray-500 font-mono">
                  QR: {product.qrCode}
                </p>
                <p className="text-xs text-gray-400">
                  Added: {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(product)}
                  className="flex-1"
                >
                  <div className='flex items-center'>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                  </div>
                </Button>
                <Button
                  variant="edit"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                 <div className="flex items-center">
                 <Pencil className="w-4 h-4 mr-1" />
                 Edit
                 </div>
                </Button>
                <Button 
                  variant="delete"
                  size="sm"
                  onClick={() => handleDelete(product)}
                  className="flex-1"
                >
                  <div className="flex items-center">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                  </div>
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No products found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 p-5 rounded-sm shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-black">
            Manage Products
          </h1>
          <p className="text-gray-900">
            View, search, and manage your product inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">Table</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                viewMode === 'card' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium">Cards</span>
            </button>
          </div>

          <Button 
            variant="primary" 
            size="md"
            onClick={() => navigate('/products/add')}
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Search & Filter Products"
        resultsCount={filteredProducts.length}
        totalCount={products.length}
      />

      {/* Content - Table or Card View */}
      {viewMode === 'table' ? (
        <SharedTable
          columns={columns}
          data={filteredProducts}
          loading={loading}
          renderRowActions={renderRowActions}
          pageSize={10}
        />
      ) : (
        <CardView />
      )}

      {/* View Product Modal */}
      {selectedProduct && (
        <ViewProductModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          product={selectedProduct}
        />
      )}

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          product={selectedProduct}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}

export default ProductManage
