import axios from 'axios'

const API_BASE_URL = 'https://pos-system-management-server-20.vercel.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Sales API
export const salesAPI = {
  getAll: async () => {
    const response = await api.get('/sales')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/sales/${id}`)
    return response.data
  },
  
  getByInvoiceNo: async (invoiceNo) => {
    const response = await api.get(`/sales/invoice/${invoiceNo}`)
    return response.data
  },
  
  create: async (saleData) => {
    const response = await api.post('/sales', saleData)
    return response.data
  },
  
  hold: async (saleData) => {
    const response = await api.post('/sales/hold', saleData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/sales/${id}`)
    return response.data
  }
}

// Products API for POS
export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  
  getByBarcode: async (barcode) => {
    const response = await api.get(`/products/barcode/${barcode}`)
    return response.data
  },
  
  update: async (id, productData) => {
    try {
      console.log('Updating product:', id, productData)
      const response = await api.put(`/products/${id}`, productData)
      console.log('Product update response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error in productsAPI.update:', error)
      throw error
    }
  },
  
  create: async (productData) => {
    const response = await api.post('/products', productData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  }
}

// Inventory API
export const inventoryAPI = {
  getAll: async () => {
    const response = await api.get('/inventory')
    return response.data
  },
  
  getByProductId: async (productId) => {
    const response = await api.get(`/inventory/product/${productId}`)
    return response.data
  }
}

// Customers API
export const customersAPI = {
  getAll: async () => {
    const response = await api.get('/customers')
    return response.data
  },
  
  create: async (customerData) => {
    const response = await api.post('/customers', customerData)
    return response.data
  },
  
  update: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/customers/${id}`)
    return response.data
  }
}

// Discounts API
export const discountsAPI = {
  getAll: async () => {
    const response = await api.get('/discounts')
    return response.data
  },
  
  getActive: async () => {
    const response = await api.get('/discounts')
    const discounts = response.data
    return discounts.filter(d => d.status === 'Active')
  },
  
  create: async (discountData) => {
    const response = await api.post('/discounts', discountData)
    return response.data
  },
  
  update: async (id, discountData) => {
    const response = await api.put(`/discounts/${id}`, discountData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/discounts/${id}`)
    return response.data
  }
}

// Sales Payments API
export const salesPaymentsAPI = {
  getAll: async () => {
    const response = await api.get('/sales-payments')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/sales-payments/${id}`)
    return response.data
  },
  
  getByInvoiceNo: async (invoiceNo) => {
    const response = await api.get(`/sales-payments/invoice/${invoiceNo}`)
    return response.data
  },
  
  create: async (paymentData) => {
    const response = await api.post('/sales-payments', paymentData)
    return response.data
  },
  
  update: async (id, paymentData) => {
    const response = await api.put(`/sales-payments/${id}`, paymentData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/sales-payments/${id}`)
    return response.data
  }
}

export default api

