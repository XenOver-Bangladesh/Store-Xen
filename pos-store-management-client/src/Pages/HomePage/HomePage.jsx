import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, PieChart, Package, TrendingUp, AlertTriangle, Clock, CreditCard, PlusCircle, ShoppingBag, FileText, Calendar, ArrowRight, RefreshCw } from 'lucide-react'
import Swal from 'sweetalert2'
import { dashboardAPI } from './services/dashboardService'
import Button from '../../Components/UI/Button'
import { DashboardLoading } from '../../Components/UI/LoadingAnimation'

export const HomePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeFilter, setTimeFilter] = useState('today')
  const [data, setData] = useState({
    sales: [],
    inventory: [],
    products: [],
    suppliers: [],
    lowStock: [],
    topProducts: [],
    recentActivities: [],
    alerts: [],
    salesData: { labels: [], data: [] }
  })

  // Helper functions
  const calculateSalesToday = (sales) => {
    if (!sales || !Array.isArray(sales)) return 0
    
    console.log('Sales data for calculation:', sales)
    console.log('First sale object structure:', sales[0])
    console.log('All sale objects:', sales.map((sale, index) => ({ index, sale })))
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todaySales = sales.filter(sale => {
      if (!sale) return false
      const saleDate = new Date(sale.createdAt || sale.date || sale.timestamp)
      saleDate.setHours(0, 0, 0, 0)
      return saleDate.getTime() === today.getTime()
    })
    
    console.log('Today sales filtered:', todaySales)
    
    const total = todaySales.reduce((total, sale) => {
      // Handle sales data structure - check grandTotal first (most common in POS systems)
      const amount = sale.grandTotal || sale.totalAmount || sale.amount || sale.total || sale.totalPrice || sale.price || 0
      console.log('Sale amount:', amount, 'from sale:', sale)
      console.log('Sale keys:', Object.keys(sale))
      return total + (typeof amount === 'number' ? amount : parseFloat(amount) || 0)
    }, 0)
    
    console.log('Total sales today:', total)
    return total
  }

  const calculatePendingPayments = (suppliers) => {
    if (!suppliers || !Array.isArray(suppliers)) return 0
    
    return suppliers.reduce((total, supplier) => {
      if (!supplier) return total
      const balance = supplier.outstandingBalance || supplier.balance || supplier.dueAmount || supplier.pendingAmount || 0
      return total + (typeof balance === 'number' ? balance : parseFloat(balance) || 0)
    }, 0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle
      case 'info': return CreditCard
      case 'clock': return Clock
      default: return AlertTriangle
    }
  }

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-800 bg-red-50 ring-red-200'
      case 'medium': return 'text-amber-900 bg-amber-50 ring-amber-200'
      case 'low': return 'text-blue-800 bg-blue-50 ring-blue-200'
      default: return 'text-gray-800 bg-gray-50 ring-gray-200'
    }
  }

  // Calculate total sales (fallback if today's sales are 0)
  const calculateTotalSales = (sales) => {
    if (!sales || !Array.isArray(sales)) return 0
    
    console.log('Calculating total sales from:', sales.length, 'sales')
    
    return sales.reduce((total, sale, index) => {
      // Handle sales data structure - check grandTotal first (most common in POS systems)
      const amount = sale.grandTotal || sale.totalAmount || sale.amount || sale.total || sale.totalPrice || sale.price || 0
      console.log(`Sale ${index} amount:`, amount, 'keys:', Object.keys(sale))
      console.log(`Sale ${index} full data:`, sale)
      return total + (typeof amount === 'number' ? amount : parseFloat(amount) || 0)
    }, 0)
  }

  // Calculate metrics
  const salesToday = calculateSalesToday(data.sales)
  const totalSales = calculateTotalSales(data.sales)
  
  const metrics = {
    salesToday: salesToday > 0 ? salesToday : totalSales,
    totalStockItems: data.products.length,
    totalStockValue: data.totalStockValue || 0,
    lowStockAlerts: data.lowStock.length,
    pendingPayments: calculatePendingPayments(data.suppliers)
  }

  // Debug metrics calculation
  console.log('Metrics calculated:', {
    salesData: data.sales,
    salesToday: salesToday,
    totalSales: totalSales,
    finalSalesToday: metrics.salesToday,
    productsData: data.products,
    totalStockItems: metrics.totalStockItems,
    totalStockValue: metrics.totalStockValue,
    suppliersData: data.suppliers,
    pendingPayments: metrics.pendingPayments
  })

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const [overview, salesData, topProducts, activities, alerts] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getSalesData(timeFilter),
        dashboardAPI.getTopProducts(4),
        dashboardAPI.getRecentActivities(),
        dashboardAPI.getAlerts()
      ])

      console.log('Dashboard data fetched:', {
        overview,
        salesData,
        topProducts,
        activities,
        alerts
      })

      setData({
        ...overview,
        topProducts,
        recentActivities: activities,
        alerts,
        salesData
      })
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load dashboard data',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setLoading(false)
    }
  }, [timeFilter])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const handleExport = async () => {
    try {
      await dashboardAPI.exportData('overview')
      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: 'Dashboard data has been exported',
        confirmButtonColor: '#3B82F6'
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export dashboard data',
        confirmButtonColor: '#3B82F6'
      })
    }
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case 'Create Purchase Order':
        navigate('/suppliers/purchase-orders')
        break
      case 'Receive Goods (GRN)':
        navigate('/suppliers/grn')
        break
      case 'Open POS Terminal':
        navigate('/sales/pos-terminal')
        break
      case 'Generate Report':
        navigate('/inventory/sales-reports')
        break
      default:
        break
    }
  }

  const handleAlertClick = (alert) => {
    switch (alert.type) {
      case 'warning':
        if (alert.title.includes('Low Stock')) {
          navigate('/inventory/low-stock')
        } else if (alert.title.includes('Expiry')) {
          navigate('/warehouse/batch-tracking')
        }
        break
      case 'info':
        if (alert.title.includes('Payment')) {
          navigate('/suppliers/manage')
        }
        break
      default:
        break
    }
  }

  if (loading) {
    return <DashboardLoading message="Loading dashboard data..." />
  }
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hello Admin, here's your business snapshot today</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of sales, inventory and activities</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-white/70 backdrop-blur px-1 py-1 ring-1 ring-slate-200/70">
              {['Today', 'Week', 'Month'].map((label) => (
                <Button
                  key={label} 
                  onClick={() => setTimeFilter(label.toLowerCase())}
                  variant={timeFilter === label.toLowerCase() ? 'primary' : 'ghost'}
                  size="sm"
                  className="px-3 py-1.5 text-sm rounded-full"
                >
                  <div className="flex items-center gap-2">
                    {label}
                  </div>
                </Button>
              ))}
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              loading={refreshing}
              variant="secondary"
              size="sm"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </div>
            </Button>
            <Button
              onClick={handleExport}
              variant="primary"
              size="sm"
              className="md:ml-2"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Export Snapshot
              </div>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Sales Today */}
          <div className="group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Sales Today</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(metrics.salesToday)}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  {data.sales.length > 0 ? `${data.sales.length} transactions` : 'Loading sales data...'}
                </p>
                {salesToday === 0 && totalSales > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    Showing total sales (no sales today)
                  </p>
                )}
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700">
                <TrendingUp />
              </div>
            </div>
          </div>

          {/* Total Stock Items */}
          <div className="group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Total Stock Items</p>
                <p className="text-3xl font-bold mt-1">{metrics.totalStockItems.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">SKU count across all categories</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700">
                <Package />
              </div>
            </div>
          </div>

          {/* Total Stock Value */}
          <div className="group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Total Stock Value</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(metrics.totalStockValue)}</p>
                <p className="text-xs text-slate-500 mt-1">Current inventory value</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 text-green-700">
                <TrendingUp />
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div 
            className="group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate('/inventory/low-stock')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Low Stock Alerts</p>
                <p className="text-3xl font-bold mt-1 text-red-600">{metrics.lowStockAlerts}</p>
                <p className="text-xs text-red-600 mt-1">Reorder recommended</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100 text-red-700">
                <AlertTriangle />
              </div>
            </div>
          </div>

          {/* Pending Payments */}
          <div 
            className="group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate('/suppliers/manage')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Pending Payments</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(metrics.pendingPayments)}</p>
                <p className="text-xs text-amber-600 mt-1">Due to suppliers</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700">
                <CreditCard />
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Graphs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm xl:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-indigo-600" />
              <h2 className="font-semibold">Sales Trend</h2>
              <div className="ml-auto flex items-center gap-1">
                {['Daily', 'Weekly', 'Monthly'].map((t) => (
                  <Button
                    key={t} 
                    onClick={() => setTimeFilter(t.toLowerCase())}
                    variant={timeFilter === t.toLowerCase() ? 'primary' : 'ghost'}
                    size="sm"
                    className="text-xs px-2.5 py-1 rounded-full"
                  >
                    <div className="flex items-center gap-2">
                      {t}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-64 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50/50 to-white flex items-center justify-center">
              {data.salesData.labels.length > 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-indigo-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Sales data visualization</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {data.salesData.labels.length} data points for {timeFilter} period
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No sales data available</p>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="text-emerald-600" />
              <h2 className="font-semibold">Stock Distribution</h2>
            </div>
            <div className="h-64 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50/50 to-white flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-emerald-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Stock categories</p>
                <p className="text-xs text-slate-400 mt-1">
                  {data.products.length} total products
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-indigo-600" />
            <h2 className="font-semibold">Top Selling Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.topProducts.length > 0 ? (
              data.topProducts.map((product, index) => (
                <div key={product._id || index} className="rounded-xl ring-1 ring-slate-200/70 p-4 hover:shadow-md transition">
                  <p className="font-medium">{product.name || product.productName || 'Unknown Product'}</p>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                    <span>Sold</span>
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> 
                      {product.quantitySold || product.salesCount || product.soldQuantity || Math.floor(20 - index * 2)} units
                    </span>
                  </div>
                </div>
              ))
            ) : (
              data.products.slice(0, 4).map((product, index) => {
                const stockQty = product.stockQty || product.quantity || product.stock || product.availableQuantity || product.inStock || 0
                const productName = product.name || product.productName || product.title || `Product ${index + 1}`
                
                return (
                  <div key={product._id || index} className="rounded-xl ring-1 ring-slate-200/70 p-4 hover:shadow-md transition">
                    <p className="font-medium">{productName}</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                      <span>Available</span>
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <Package className="w-3.5 h-3.5 text-blue-600" /> 
                        {stockQty} units
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Alerts & Notifications + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-600" />
              <h2 className="font-semibold">Alerts & Notifications</h2>
            </div>
            <ul className="space-y-3">
              {data.alerts.length > 0 ? (
                data.alerts.slice(0, 3).map((alert, index) => {
                  const IconComponent = getAlertIcon(alert.icon)
                  const colorClasses = getAlertColor(alert.severity)
                  
                  return (
                    <li 
                      key={alert.id || index} 
                      className={`flex items-start gap-3 text-sm rounded-xl p-3 ring-1 cursor-pointer hover:shadow-md transition ${colorClasses}`}
                      onClick={() => handleAlertClick(alert)}
                    >
                      <IconComponent className="w-4 h-4 mt-0.5" />
                      <div>
                        <p className="font-semibold">{alert.title}</p>
                        <p>{alert.message}</p>
                      </div>
                    </li>
                  )
                })
              ) : (
                <li className="flex items-center gap-3 text-sm rounded-xl p-3 ring-1 ring-slate-200/60 bg-slate-50/60 text-slate-600">
                  <AlertTriangle className="w-4 h-4" />
                  <div>
                    <p className="font-semibold">No Alerts</p>
                    <p>All systems running smoothly</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: PlusCircle, label: 'Create Purchase Order' }, 
                { icon: Package, label: 'Receive Goods (GRN)' }, 
                { icon: ShoppingBag, label: 'Open POS Terminal' }, 
                { icon: FileText, label: 'Generate Report' }
              ].map(({ icon, label }) => (
                <Button
                  key={label} 
                  onClick={() => handleQuickAction(label)}
                  variant="ghost"
                  className="group text-left rounded-xl ring-1 ring-slate-200/70 p-4 hover:shadow-md transition h-auto flex-col items-start"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-100 to-white flex items-center justify-center mb-2">
                      {React.createElement(icon, { className: 'w-5 h-5 text-slate-700' })}
                    </div>
                    <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      {label}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Recent Activities</h2>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
            <ul className="space-y-4">
              {data.recentActivities.length > 0 ? (
                data.recentActivities.map((activity, i) => (
                  <li key={activity.id || i} className="pl-8 relative">
                    <span className="absolute left-1 top-1.5 w-4 h-4 rounded-full bg-white ring-2 ring-indigo-500" />
                    <div className="rounded-lg ring-1 ring-slate-200/70 p-3 bg-white/70">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="pl-8 relative">
                  <span className="absolute left-1 top-1.5 w-4 h-4 rounded-full bg-white ring-2 ring-slate-300" />
                  <div className="rounded-lg ring-1 ring-slate-200/70 p-3 bg-white/70">
                    <p className="text-sm text-slate-500">No recent activities</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
