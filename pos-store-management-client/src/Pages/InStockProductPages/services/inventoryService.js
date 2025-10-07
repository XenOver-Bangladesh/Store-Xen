import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pos-system-management-server-20.vercel.app'

// API Services
export const inventoryAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/inventory`)
    return response.data
  },
  
  getByProductId: async (productId) => {
    const response = await axios.get(`${API_BASE_URL}/inventory/product/${productId}`)
    return response.data
  }
}

export const productsAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/products`)
    return response.data
  }
}

