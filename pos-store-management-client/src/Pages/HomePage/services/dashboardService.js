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

      console.log('Dashboard overview data:', result)
      return result
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Return empty data structure instead of throwing
      return {
        sales: [],
        inventory: [],
        products: [],
        suppliers: [],
        lowStock: []
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
      const [sales, purchases, grns] = await Promise.allSettled([
        api.get('/sales?limit=5&sort=-createdAt').catch(() => ({ data: [] })),
        api.get('/purchase-orders?limit=3&sort=-createdAt').catch(() => ({ data: [] })),
        api.get('/grn?limit=3&sort=-createdAt').catch(() => ({ data: [] }))
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
          description: `৳${amount} - ${status} via ${paymentMethod}`,
          timestamp: sale.createdAt || sale.date,
          icon: 'receipt'
        })
      })

      // Process purchase orders
      const purchasesData = purchases.status === 'fulfilled' ? purchases.value.data : []
      purchasesData.forEach(po => {
        activities.push({
          id: po._id,
          type: 'purchase',
          title: `PO #${po.poNumber || po._id.slice(-6)}`,
          description: `Sent to ${po.supplierName || 'Supplier'}`,
          timestamp: po.createdAt,
          icon: 'shopping-cart'
        })
      })

      // Process GRNs
      const grnsData = grns.status === 'fulfilled' ? grns.value.data : []
      grnsData.forEach(grn => {
        activities.push({
          id: grn._id,
          type: 'grn',
          title: `GRN #${grn.grnNumber || grn._id.slice(-6)}`,
          description: `Received - ${grn.totalItems || 0} items added to stock`,
          timestamp: grn.createdAt,
          icon: 'package'
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
      const [lowStock, expired, payments] = await Promise.all([
        api.get('/inventory/low-stock/5'), // Very low stock
        api.get('/inventory/expiring/30'), // Expiring in 30 days
        api.get('/suppliers/payments-due') // Due payments
      ])

      const alerts = []

      // Low stock alerts
      lowStock.data.forEach(item => {
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

      // Expiry alerts
      expired.data.forEach(item => {
        const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
        alerts.push({
          id: `expiry-${item._id}`,
          type: 'warning',
          severity: daysLeft <= 7 ? 'high' : 'medium',
          title: 'Expiry Alert',
          message: `${item.productName || 'Product'} batch expiring in ${daysLeft} days`,
          timestamp: new Date(),
          icon: 'clock'
        })
      })

      // Payment due alerts
      payments.data.forEach(payment => {
        alerts.push({
          id: `payment-${payment._id}`,
          type: 'info',
          severity: 'medium',
          title: 'Payment Due',
          message: `${payment.supplierName || 'Supplier'} - ৳${payment.amount || 0} Due`,
          timestamp: new Date(),
          icon: 'credit-card'
        })
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
      const response = await api.get(`/dashboard/export?type=${type}`, {
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
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
