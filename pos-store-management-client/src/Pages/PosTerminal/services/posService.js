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
  
  getByBarcode: async (barcode) => {
    const response = await api.get(`/products/barcode/${barcode}`)
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
  }
}

export default api

