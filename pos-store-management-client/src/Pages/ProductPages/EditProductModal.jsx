import React, { useState, useEffect } from 'react'
import SharedModal from '../../Shared/SharedModal/SharedModal'
import Button from '../../Components/UI/Button'
import axios from 'axios'
import Swal from 'sweetalert2'

const EditProductModal = ({ isOpen, onClose, product, onSuccess }) => {
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
  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverage',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Health & Beauty',
    'Toys & Games'
  ]
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        category: product.category || '',
        brand: product.brand || '',
        description: product.description || '',
        qrCode: product.qrCode || '',
        supplier: product.supplier || '',
        productImage: product.productImage || ''
      })
      setImagePreview(product.productImage || null)
    }
  }, [product])

  useEffect(() => {
    if (isOpen) {
      fetchSuppliers()
      fetchAllProducts()
    }
  }, [isOpen])

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('https://pos-system-management-server-20.vercel.app/suppliers')
      setSuppliers(response.data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get('https://pos-system-management-server-20.vercel.app/Products')
      setAllProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const generateQRCode = () => {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase()
    const qrValue = `PRD-${randomStr}-${timestamp}`
    setFormData(prev => ({ ...prev, qrCode: qrValue }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Invalid File',
        text: 'Please select an image file',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Image size should be less than 5MB',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
      return
    }

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

    if (!formData.qrCode.trim()) {
      newErrors.qrCode = 'QR Code is required'
    } else {
      // Check for duplicate QR code (excluding current product)
      const duplicateQR = allProducts.find(
        p => p.qrCode === formData.qrCode && p._id !== product._id
      )
      if (duplicateQR) {
        newErrors.qrCode = 'This QR Code already exists. Please generate a new one.'
      }
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

      // Upload new image if selected
      if (imageFile) {
        try {
          imageUrl = await uploadToImgBB(imageFile)
        } catch (uploadError) {
          console.error('Image upload error:', uploadError)
          const result = await Swal.fire({
            title: 'Upload Failed',
            text: 'Failed to upload image. Continue with old image?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Continue',
            cancelButtonText: 'Cancel'
          })
          
          if (!result.isConfirmed) {
            setIsSubmitting(false)
            return
          }
        }
      }

      const updatedData = {
        ...formData,
        productImage: imageUrl
      }

      await axios.put(
        `https://pos-system-management-server-20.vercel.app/Products/${product._id}`,
        updatedData
      )

      await Swal.fire({
        title: 'Success!',
        text: 'Product updated successfully!',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true
      })

      onSuccess()
    } catch (error) {
      console.error('Error updating product:', error)
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update product',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setImageFile(null)
    setErrors({})
    onClose()
  }

  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button
        variant="secondary"
        size="md"
        onClick={handleClose}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Updating...' : 'Update Product'}
      </Button>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Product"
      size="large"
      footer={modalFooter}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Image */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Product Image</label>
          {imagePreview ? (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview(null)
                    setFormData(prev => ({ ...prev, productImage: '' }))
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-lg"
                  title="Remove Image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Change Image Button */}
              <label className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition text-blue-600 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Change Image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
              </label>
              {imageFile && (
                <p className="text-xs text-blue-600 font-medium">✓ New image selected - will upload on save</p>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
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

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700" htmlFor="productName">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="productName"
              name="productName"
              type="text"
              value={formData.productName}
              onChange={handleInputChange}
              className={`block w-full rounded-xl border ${errors.productName ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm`}
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
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`block w-full rounded-xl border ${errors.category ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm`}
            >
              <option value="">Select Category...</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
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
              value={formData.brand}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm"
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
              className="block w-full rounded-xl border border-gray-300 hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm"
            >
              <option value="">Select Supplier...</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier.supplierName}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
          </div>

          {/* QR Code - Full Width */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="qrCode">
              QR Code <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="qrCode"
                name="qrCode"
                type="text"
                value={formData.qrCode}
                onChange={handleInputChange}
                className={`block w-full rounded-xl border ${errors.qrCode ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm font-mono`}
                placeholder="PRD-XXXXXXXX-XXXXXXXXXXXXX"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateQRCode}
                className="whitespace-nowrap"
              >
                Generate New
              </Button>
            </div>
            {errors.qrCode && (
              <p className="text-xs text-red-600">{errors.qrCode}</p>
            )}
            <div className="flex items-center gap-3 mt-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${formData.qrCode}`}
                  alt="QR Code Preview"
                  className="w-24 h-24"
                />
              </div>
              <p className="text-xs text-gray-500">QR Code Preview</p>
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>
      </form>
    </SharedModal>
  )
}

export default EditProductModal

