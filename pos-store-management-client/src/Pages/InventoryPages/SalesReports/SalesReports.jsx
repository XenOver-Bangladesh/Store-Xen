import React, { useState, useEffect } from 'react'
import { TrendingUp, FileText, Users, Calendar, RefreshCw, Filter, Download, BarChart3 } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import StatsCard from '../../../Shared/StatsCard/StatsCard'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReuseableFilter } from '../../../Shared/ReuseableFilter/ReuseableFilter'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { salesAPI, productsAPI, customersAPI } from '../services/inventoryService'
import { ReportLoading } from '../../../Components/UI/LoadingAnimation'

const SalesReports = () => {
  const [salesData, setSalesData] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    customer: '',
    product: '',
    paymentMethod: ''
  })

  // Summary stats
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalAmount: 0,
    totalProfit: 0,
    averageOrderValue: 0,
    topProducts: [],
    salesTrend: []
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [sales, productsData, customersData] = await Promise.all([
        salesAPI.getAll(),
        productsAPI.getAll(),
        customersAPI.getAll()
      ])
      
      setProducts(productsData)
      setCustomers(customersData)
      
      // Filter sales by date range
      let filteredSales = sales
      if (filters.dateFrom) {
        filteredSales = filteredSales.filter(sale => 
          new Date(sale.createdAt) >= new Date(filters.dateFrom)
        )
      }
      if (filters.dateTo) {
        filteredSales = filteredSales.filter(sale => 
          new Date(sale.createdAt) <= new Date(filters.dateTo)
        )
      }
      
      setSalesData(filteredSales)
      calculateSummary(filteredSales, productsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateSummary = (sales, productsData) => {
    const totalSales = sales.length
    const totalAmount = sales.reduce((sum, sale) => sum + sale.grandTotal, 0)
    
    // Calculate profit
    const totalProfit = sales.reduce((sum, sale) => {
      const itemProfit = sale.items.reduce((itemSum, item) => {
        const product = productsData.find(p => p._id === item.productId)
        if (!product) return itemSum
        const profit = (item.unitPrice - (product.costPrice || 0)) * item.quantity
        return itemSum + profit
      }, 0)
      return sum + itemProfit
    }, 0)
    
    const averageOrderValue = totalSales > 0 ? totalAmount / totalSales : 0
    
    // Top products
    const productSales = {}
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0
          }
        }
        productSales[item.productId].quantity += item.quantity
        productSales[item.productId].revenue += item.unitPrice * item.quantity
      })
    })
    
    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({
        productId,
        name: data.name,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
    
    // Sales trend (last 7 days)
    const salesTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt)
        return saleDate.toDateString() === date.toDateString()
      })
      salesTrend.push({
        date: date.toISOString().split('T')[0],
        sales: daySales.length,
        amount: daySales.reduce((sum, sale) => sum + sale.grandTotal, 0)
      })
    }
    
    setSummary({
      totalSales,
      totalAmount,
      totalProfit,
      averageOrderValue,
      topProducts,
      salesTrend
    })
  }

  const formatCurrency = (amount) => `BDT ${amount.toFixed(2)}`
  const formatDate = (date) => new Date(date).toLocaleDateString()
  const formatDateTime = (date) => new Date(date).toLocaleString()

  const filteredSales = salesData.filter(sale => {
    const matchesSearch = !filters.search || 
      sale.invoiceNo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCustomer = !filters.customer || sale.customerId === filters.customer
    const matchesPaymentMethod = !filters.paymentMethod || sale.paymentMethod === filters.paymentMethod
    
    const matchesProduct = !filters.product || 
      sale.items.some(item => item.productId === filters.product)

    return matchesSearch && matchesCustomer && matchesPaymentMethod && matchesProduct
  })

  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by invoice or customer...'
    },
    {
      key: 'dateFrom',
      label: 'From Date',
      type: 'date'
    },
    {
      key: 'dateTo',
      label: 'To Date',
      type: 'date'
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'select',
      options: [
        { label: 'All Customers', value: '' },
        ...customers.map(c => ({ label: c.name, value: c._id }))
      ]
    },
    {
      key: 'product',
      label: 'Product',
      type: 'select',
      options: [
        { label: 'All Products', value: '' },
        ...products.map(p => ({ label: p.productName, value: p._id }))
      ]
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      options: [
        { label: 'All Methods', value: '' },
        { label: 'Cash', value: 'Cash' },
        { label: 'Card', value: 'Card' },
        { label: 'Bank Transfer', value: 'Bank Transfer' },
        { label: 'Mobile Banking', value: 'Mobile Banking' }
      ]
    }
  ]

  const tableColumns = [
    {
      id: 'date',
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{formatDate(row.original.createdAt)}</div>
          <div className="text-sm text-gray-500">{formatDateTime(row.original.createdAt).split(',')[1]}</div>
        </div>
      )
    },
    {
      id: 'invoiceNo',
      accessorKey: 'invoiceNo',
      header: 'Invoice No',
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium text-blue-600">
          {row.original.invoiceNo}
        </div>
      )
    },
    {
      id: 'customer',
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.customerName || 'Walk-in'}</div>
          {row.original.customerPhone && (
            <div className="text-sm text-gray-500">{row.original.customerPhone}</div>
          )}
        </div>
      )
    },
    {
      id: 'totalAmount',
      accessorKey: 'grandTotal',
      header: 'Total Amount',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(row.original.grandTotal)}</div>
          <div className="text-xs text-gray-500">{row.original.items.length} items</div>
        </div>
      )
    },
    {
      id: 'paymentMethod',
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {row.original.paymentMethod}
          </span>
        </div>
      )
    },
    {
      id: 'profit',
      accessorKey: 'profit',
      header: 'Profit',
      cell: ({ row }) => {
        const sale = row.original
        const profit = sale.items.reduce((sum, item) => {
          const product = products.find(p => p._id === item.productId)
          if (!product) return sum
          return sum + ((item.unitPrice - (product.costPrice || 0)) * item.quantity)
        }, 0)
        
        return (
          <div className="text-right">
            <div className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profit)}
            </div>
            <div className="text-xs text-gray-500">
              {sale.grandTotal > 0 ? `${((profit / sale.grandTotal) * 100).toFixed(1)}%` : '0%'}
            </div>
          </div>
        )
      }
    }
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      customer: '',
      product: '',
      paymentMethod: ''
    })
  }

  const handleExport = () => {
    console.log('Exporting sales report...')
  }

  if (loading) {
    return <ReportLoading message="Loading sales reports..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
              Sales Reports
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Comprehensive sales reporting and analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchData}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Refresh</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Sales"
          value={summary.totalSales}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          label="Total Amount"
          value={formatCurrency(summary.totalAmount)}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          label="Total Profit"
          value={formatCurrency(summary.totalProfit)}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          label="Avg Order Value"
          value={formatCurrency(summary.averageOrderValue)}
          icon={Users}
          color="yellow"
        />
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Sales Analytics Dashboard"
        message="Analyze your sales performance with detailed reports. Use date filters to focus on specific periods, and track profit margins to optimize your pricing strategy. Monitor top-selling products to identify trends."
        icon={TrendingUp}
      />

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Top 5 Selling Products
        </h3>
        <div className="space-y-3">
          {summary.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.quantity} units sold</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{formatCurrency(product.revenue)}</div>
                <div className="text-sm text-gray-500">revenue</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Trend Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Sales Trend (Last 7 Days)
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization will be implemented here</p>
            <p className="text-sm text-gray-400">Daily sales trend over the last week</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Sales Filters"
        resultsCount={filteredSales.length}
        totalCount={salesData.length}
      />

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Sales Transactions
          </h3>
        </div>
        <SharedTable
          data={filteredSales}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No sales data available"
        />
      </div>
    </div>
  )
}

export default SalesReports
