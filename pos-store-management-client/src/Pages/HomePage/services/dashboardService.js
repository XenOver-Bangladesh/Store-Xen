import axios from 'axios'

const API_BASE_URL = 'https://pos-system-management-server-20.vercel.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Dashboard API Service
export const dashboardAPI = {
  // Get dashboard overview data
  getOverview: async () => {
    try {
      console.log('Fetching dashboard overview data...')
      
      const [sales, inventory, products, suppliers, lowStock] = await Promise.allSettled([
        api.get('/sales').catch(err => {
          console.error('Sales API error:', err)
          return { data: [] }
        }),
        api.get('/inventory').catch(err => {
          console.error('Inventory API error:', err)
          return { data: [] }
        }),
        api.get('/products').catch(err => {
          console.error('Products API error:', err)
          return { data: [] }
        }),
        api.get('/suppliers').catch(err => {
          console.error('Suppliers API error:', err)
          return { data: [] }
        }),
        api.get('/inventory/low-stock/10').catch(err => {
          console.error('Low stock API error:', err)
          return { data: [] }
        })
      ])

      const result = {
        sales: sales.status === 'fulfilled' ? (sales.value.data || []) : [],
        inventory: inventory.status === 'fulfilled' ? (inventory.value.data || []) : [],
        products: products.status === 'fulfilled' ? (products.value.data || []) : [],
        suppliers: suppliers.status === 'fulfilled' ? (suppliers.value.data || []) : [],
        lowStock: lowStock.status === 'fulfilled' ? (lowStock.value.data || []) : []
      }

      // Calculate total stock value
      const inventoryData = result.inventory
      const productsData = result.products
      
      console.log('Inventory data for stock value calculation:', inventoryData)
      console.log('Products data for stock value calculation:', productsData)
      
      const totalStockValue = inventoryData.reduce((sum, item) => {
        const product = productsData.find(p => p._id === item.productId)
        const stockQty = item.stockQty || item.quantity || item.stock || 0
        const costPrice = product?.costPrice || product?.purchasePrice || 0
        
        console.log(`Item: ${item.productName || 'Unknown'}, StockQty: ${stockQty}, CostPrice: ${costPrice}, Product:`, product)
        
        return sum + (stockQty * costPrice)
      }, 0)

      result.totalStockValue = totalStockValue

      console.log('Dashboard overview data:', result)
      console.log('Total stock value calculated:', totalStockValue)
      return result
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Return empty data structure instead of throwing
      return {
        sales: [],
        inventory: [],
        products: [],
        suppliers: [],
        lowStock: [],
        totalStockValue: 0
      }
    }
  },

  // Get sales data for charts
  getSalesData: async (period = 'today') => {
    try {
      // Map frontend period names to backend expected values
      const periodMap = {
        'today': 'today',
        'week': 'week',
        'month': 'month',
        'daily': 'today',
        'weekly': 'week',
        'monthly': 'month'
      }
      
      const mappedPeriod = periodMap[period.toLowerCase()] || 'week'
      console.log(`Fetching sales data for period: ${period} (mapped to: ${mappedPeriod})`)
      
      const response = await api.get(`/sales/analytics?period=${mappedPeriod}`)
      console.log('Sales data response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('Error fetching sales data:', error)
      // Return empty data if API fails
      return {
        labels: [],
        data: []
      }
    }
  },

  // Get top selling products
  getTopProducts: async (limit = 4) => {
    try {
      const response = await api.get(`/products/top-selling?limit=${limit}`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching top products:', error)
      return []
    }
  },

  // Get recent activities
  getRecentActivities: async () => {
    try {
      const [sales] = await Promise.allSettled([
        api.get('/sales?limit=5&sort=-createdAt').catch(() => ({ data: [] }))
      ])

      const activities = []
      
      // Process sales
      const salesData = sales.status === 'fulfilled' ? sales.value.data : []
      salesData.forEach(sale => {
        const amount = sale.grandTotal || sale.totalAmount || sale.amount || sale.total || 0
        const paymentMethod = sale.paymentMethod || 'Cash'
        const status = sale.status || 'Completed'
        const invoiceRef = sale.invoiceNo || sale._id?.slice(-6) || 'N/A'
        
        activities.push({
          id: sale._id,
          type: 'sale',
          title: `Sale #${invoiceRef}`,
          description: `BDT ${amount} - ${status} via ${paymentMethod}`,
          timestamp: sale.createdAt || sale.date,
          icon: 'receipt'
        })
      })

      // Sort by timestamp and return latest 5
      return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
    } catch (error) {
      console.error('Error fetching recent activities:', error)
      return []
    }
  },

  // Get alerts and notifications
  getAlerts: async () => {
    try {
      const [lowStock, suppliers] = await Promise.allSettled([
        api.get('/inventory/low-stock/5').catch(err => {
          console.error('Low stock API error:', err)
          return { data: [] }
        }),
        api.get('/suppliers').catch(err => {
          console.error('Suppliers API error:', err)
          return { data: [] }
        })
      ])

      const alerts = []

      // Low stock alerts
      const lowStockData = lowStock.status === 'fulfilled' ? lowStock.value.data : []
      lowStockData.forEach(item => {
        alerts.push({
          id: `low-stock-${item._id}`,
          type: 'warning',
          severity: 'high',
          title: 'Low Stock Alert',
          message: `${item.productName || 'Product'} only ${item.stockQty || 0} left`,
          timestamp: new Date(),
          icon: 'alert-triangle'
        })
      })

      // Payment due alerts (using suppliers data)
      const suppliersData = suppliers.status === 'fulfilled' ? suppliers.value.data : []
      suppliersData.forEach(supplier => {
        const outstandingBalance = supplier.outstandingBalance || supplier.balance || supplier.dueAmount || 0
        if (outstandingBalance > 0) {
          alerts.push({
            id: `payment-${supplier._id}`,
            type: 'info',
            severity: 'medium',
            title: 'Payment Due',
            message: `${supplier.name || 'Supplier'} - BDT ${outstandingBalance} Due`,
            timestamp: new Date(),
            icon: 'credit-card'
          })
        }
      })

      return alerts.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      })
    } catch (error) {
      console.error('Error fetching alerts:', error)
      return []
    }
  },

  // Export dashboard data
  exportData: async (type = 'overview') => {
    try {
      // For now, return a mock export since the endpoint doesn't exist
      console.log(`Exporting dashboard data for type: ${type}`)
      
      // Create a simple CSV export
      const csvData = `Dashboard Export - ${type}\nDate,${new Date().toISOString().split('T')[0]}\nType,${type}\nStatus,Exported`
      
      // Create download link
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `dashboard-${type}-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
      throw error
    }
  }
}

export default dashboardAPI
