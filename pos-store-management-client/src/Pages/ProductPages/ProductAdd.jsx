import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../Components/UI/Button'
import AddCategoryModal from './AddCategoryModal'
import axios from 'axios'
import Swal from 'sweetalert2'

const ProductAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    brand: '',
    description: '',
    qrCode: '',
    supplier: '',
    productImage: ''
  })

  const [errors, setErrors] = useState({})
  const [suppliers, setSuppliers] = useState([])
  const [categories, setCategories] = useState([
    'Electronics',
    'Clothing',
    'Food & Beverage',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Health & Beauty',
    'Toys & Games'
  ])
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers()
    generateQRCode()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('https://pos-system-management-server-20.vercel.app/suppliers')
      setSuppliers(response.data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      Swal.fire({
        title: 'Warning',
        text: 'Could not fetch suppliers list',
        icon: 'warning',
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  const generateQRCode = () => {
    // Generate a unique QR code value (you can customize this logic)
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase()
    const qrValue = `PRD-${randomStr}-${timestamp}`
    setFormData(prev => ({ ...prev, qrCode: qrValue }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Invalid File',
        text: 'Please select an image file',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Image size should be less than 5MB',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    // Store file and show preview only (no upload yet)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadToImgBB = async (file) => {
    const uploadFormData = new FormData()
    uploadFormData.append('image', file)

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        uploadFormData
      )
      
      if (response.data.success) {
        return response.data.data.url
      }
      throw new Error('Upload failed')
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl = formData.productImage

      // Upload image to imgbb if a new image is selected
      if (imageFile) {
        try {
          imageUrl = await uploadToImgBB(imageFile)
        } catch (uploadError) {
          console.error('Image upload error:', uploadError)
          await Swal.fire({
            title: 'Upload Failed',
            text: 'Failed to upload image. Product will be added without image.',
            icon: 'warning',
            confirmButtonColor: '#f59e0b',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Continue'
          }).then((result) => {
            if (!result.isConfirmed) {
              throw new Error('User cancelled due to image upload failure')
            }
          })
        }
      }

      const productData = {
        ...formData,
        productImage: imageUrl,
        createdAt: new Date().toISOString()
      }

      const response = await axios.post(
        'https://pos-system-management-server-20.vercel.app/Products',
        productData
      )

      console.log('Product added:', response.data)

      await Swal.fire({
        title: 'Success!',
        text: 'Product added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true
      })

      // Reset form
      setFormData({
        productName: '',
        category: '',
        brand: '',
        description: '',
        qrCode: '',
        supplier: '',
        productImage: ''
      })
      setImageFile(null)
      setImagePreview(null)
      generateQRCode()

    } catch (error) {
      console.error('Error adding product:', error)
      if (error.message !== 'User cancelled due to image upload failure') {
        await Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || error.message || 'Failed to add product',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'All unsaved changes will be lost',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No, continue editing'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          productName: '',
          category: '',
          brand: '',
          description: '',
          qrCode: '',
          supplier: '',
          productImage: ''
        })
        setImageFile(null)
        setImagePreview(null)
        setErrors({})
        generateQRCode()
      }
    })
  }

  const handleCategoryAdded = (newCategory) => {
    setCategories(prev => [...prev, newCategory])
    setFormData(prev => ({ ...prev, category: newCategory }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 p-5 rounded-sm shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-black">
            Add New Product
          </h1>
          <p className="text-gray-900">
            Create and manage your product inventory with ease.
          </p>
        </div>

        <div>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => navigate('/products/manage')}
          >
            Manage Products
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Product Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700" htmlFor="productName">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="productName"
                  name="productName"
                  type="text"
                  placeholder="e.g. Samsung Galaxy S24"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className={`block w-full rounded-xl border ${errors.productName ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400`}
                />
                {errors.productName && (
                  <p className="text-xs text-red-600">{errors.productName}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700" htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`block w-full rounded-xl border ${errors.category ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400`}
                  >
                    <option value="">Select Category...</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="whitespace-nowrap"
                  >
                    + Add
                  </Button>
                </div>
                {errors.category && (
                  <p className="text-xs text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Brand */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700" htmlFor="brand">
                  Brand
                </label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  placeholder="e.g. Samsung"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-gray-300 hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400"
                />
              </div>

              {/* Supplier */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700" htmlFor="supplier">
                  Supplier
                </label>
                <select
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-gray-300 hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400"
                >
                  <option value="">Select Supplier...</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier.supplierName}>
                      {supplier.supplierName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description - Full Width */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Enter product description..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-gray-300 hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* QR Code & Image Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                QR Code
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-64">
                  <div className="text-center p-6">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${formData.qrCode}`}
                      alt="QR Code"
                      className="mx-auto mb-3"
                    />
                    <p className="text-xs text-gray-600 font-mono break-all">{formData.qrCode}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateQRCode}
                  className="w-full"
                >
                  Regenerate QR Code
                </Button>
              </div>
            </div>

            {/* Product Image */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                Product Image
              </h3>
              <div className="space-y-3">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                        setFormData(prev => ({ ...prev, productImage: '' }))
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Preview only - will upload on submit
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  )
}

export default ProductAdd
