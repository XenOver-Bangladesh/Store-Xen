import React, { useState, useEffect } from 'react'
import { PieChart, TrendingUp, TrendingDown, DollarSign, RefreshCw, Filter, Download, BarChart3 } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import StatsCard from '../../../Shared/StatsCard/StatsCard'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReuseableFilter } from '../../../Shared/ReuseableFilter/ReuseableFilter'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { salesAPI, productsAPI, purchaseOrdersAPI, paymentsAPI } from '../services/inventoryService'

const ProfitLossReports = () => {
  const [pLData, setPLData] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    period: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  })

  // P&L Summary
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalCOGS: 0,
    grossProfit: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    monthlyBreakdown: [],
    expenseBreakdown: []
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
      const [sales, productsData, purchaseOrders, payments] = await Promise.all([
        salesAPI.getAll(),
        productsAPI.getAll(),
        purchaseOrdersAPI.getAll(),
        paymentsAPI.getAll()
      ])
      
      setProducts(productsData)
      
      // Calculate P&L data
      const pL = calculateProfitLoss(sales, productsData, purchaseOrders, payments)
      setPLData(pL)
      calculateSummary(pL, sales, purchaseOrders, payments)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateProfitLoss = (sales, productsData, purchaseOrders, payments) => {
    const currentDate = new Date()
    const year = filters.year || currentDate.getFullYear()
    const month = filters.month || currentDate.getMonth() + 1
    
    // Filter data by period
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate.getFullYear() === year && saleDate.getMonth() + 1 === month
    })
    
    const filteredPOs = purchaseOrders.filter(po => {
      const poDate = new Date(po.createdAt)
      return poDate.getFullYear() === year && poDate.getMonth() + 1 === month
    })
    
    const filteredPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt)
      return paymentDate.getFullYear() === year && paymentDate.getMonth() + 1 === month
    })
    
    // Calculate total sales
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.grandTotal, 0)
    
    // Calculate COGS (Cost of Goods Sold)
    const totalCOGS = filteredSales.reduce((sum, sale) => {
      const itemCOGS = sale.items.reduce((itemSum, item) => {
        const product = productsData.find(p => p._id === item.productId)
        if (!product) return itemSum
        return itemSum + ((product.costPrice || 0) * item.quantity)
      }, 0)
      return sum + itemCOGS
    }, 0)
    
    // Calculate gross profit
    const grossProfit = totalSales - totalCOGS
    
    // Calculate expenses (purchase orders + other payments)
    const purchaseExpenses = filteredPOs.reduce((sum, po) => {
      return sum + (po.totalAmount || 0)
    }, 0)
    
    const otherExpenses = filteredPayments.reduce((sum, payment) => {
      return sum + (payment.amount || 0)
    }, 0)
    
    const totalExpenses = purchaseExpenses + otherExpenses
    
    // Calculate net profit
    const netProfit = grossProfit - totalExpenses
    
    // Calculate profit margin
    const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0
    
    return {
      period: `${year}-${month.toString().padStart(2, '0')}`,
      totalSales,
      totalCOGS,
      grossProfit,
      totalExpenses,
      netProfit,
      profitMargin,
      purchaseExpenses,
      otherExpenses,
      salesCount: filteredSales.length,
      purchaseCount: filteredPOs.length
    }
  }

  const calculateSummary = (pL, sales, purchaseOrders, payments) => {
    // Monthly breakdown for the year
    const monthlyBreakdown = []
    const year = filters.year || new Date().getFullYear()
    
    for (let month = 1; month <= 12; month++) {
      const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt)
        return saleDate.getFullYear() === year && saleDate.getMonth() + 1 === month
      })
      
      const monthPOs = purchaseOrders.filter(po => {
        const poDate = new Date(po.createdAt)
        return poDate.getFullYear() === year && poDate.getMonth() + 1 === month
      })
      
      const monthPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.createdAt)
        return paymentDate.getFullYear() === year && paymentDate.getMonth() + 1 === month
      })
      
      const monthSalesTotal = monthSales.reduce((sum, sale) => sum + sale.grandTotal, 0)
      const monthCOGS = monthSales.reduce((sum, sale) => {
        const itemCOGS = sale.items.reduce((itemSum, item) => {
          const product = products.find(p => p._id === item.productId)
          if (!product) return itemSum
          return itemSum + ((product.costPrice || 0) * item.quantity)
        }, 0)
        return sum + itemCOGS
      }, 0)
      
      const monthExpenses = monthPOs.reduce((sum, po) => sum + (po.totalAmount || 0), 0) +
                           monthPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
      
      const monthProfit = monthSalesTotal - monthCOGS - monthExpenses
      
      monthlyBreakdown.push({
        month: month,
        monthName: new Date(year, month - 1).toLocaleString('default', { month: 'short' }),
        sales: monthSalesTotal,
        cogs: monthCOGS,
        expenses: monthExpenses,
        profit: monthProfit
      })
    }
    
    // Expense breakdown
    const expenseBreakdown = [
      { category: 'Purchase Orders', amount: pL.purchaseExpenses, color: 'bg-blue-500' },
      { category: 'Other Payments', amount: pL.otherExpenses, color: 'bg-red-500' }
    ]
    
    setSummary({
      totalSales: pL.totalSales,
      totalCOGS: pL.totalCOGS,
      grossProfit: pL.grossProfit,
      totalExpenses: pL.totalExpenses,
      netProfit: pL.netProfit,
      profitMargin: pL.profitMargin,
      monthlyBreakdown,
      expenseBreakdown
    })
  }

  const formatCurrency = (amount) => `৳${amount.toFixed(2)}`
  const formatPercentage = (value) => `${value.toFixed(1)}%`

  const getProfitColor = (profit) => {
    return profit >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getProfitIcon = (profit) => {
    return profit >= 0 ? TrendingUp : TrendingDown
  }

  const filterConfig = [
    {
      key: 'year',
      label: 'Year',
      type: 'select',
      options: [
        { label: '2024', value: 2024 },
        { label: '2025', value: 2025 },
        { label: '2026', value: 2026 }
      ]
    },
    {
      key: 'month',
      label: 'Month',
      type: 'select',
      options: [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 }
      ]
    }
  ]

  const tableColumns = [
    {
      id: 'month',
      accessorKey: 'monthName',
      header: 'Month',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.monthName}</div>
      )
    },
    {
      id: 'sales',
      accessorKey: 'sales',
      header: 'Total Sales',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">{formatCurrency(row.original.sales)}</div>
        </div>
      )
    },
    {
      id: 'cogs',
      accessorKey: 'cogs',
      header: 'COGS',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">{formatCurrency(row.original.cogs)}</div>
        </div>
      )
    },
    {
      id: 'expenses',
      accessorKey: 'expenses',
      header: 'Expenses',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">{formatCurrency(row.original.expenses)}</div>
        </div>
      )
    },
    {
      id: 'profit',
      accessorKey: 'profit',
      header: 'Net Profit',
      cell: ({ row }) => {
        const item = row.original
        const ProfitIcon = getProfitIcon(item.profit)
        return (
          <div className="text-right">
            <div className={`font-medium flex items-center justify-end ${getProfitColor(item.profit)}`}>
              <ProfitIcon className="w-4 h-4 mr-1" />
              {formatCurrency(item.profit)}
            </div>
          </div>
        )
      }
    }
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: parseInt(value) }))
  }

  const handleClearFilters = () => {
    const currentDate = new Date()
    setFilters({
      period: 'month',
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1
    })
  }

  const handleExport = () => {
    console.log('Exporting P&L report...')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        <p className="ml-3 text-gray-600">Calculating profit & loss...</p>
      </div>
    )
  }

  const ProfitIcon = getProfitIcon(summary.netProfit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <PieChart className="w-8 h-8 mr-3 text-yellow-600" />
              Profit & Loss Reports
            </h1>
            <p className="text-gray-600 mt-2">Business profit and loss analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={fetchData}
            >
              <div className="flex items-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* P&L Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Sales"
          value={formatCurrency(summary.totalSales)}
          icon={DollarSign}
          color="blue"
        />
        <StatsCard
          label="Total COGS"
          value={formatCurrency(summary.totalCOGS)}
          icon={TrendingDown}
          color="red"
        />
        <StatsCard
          label="Gross Profit"
          value={formatCurrency(summary.grossProfit)}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          label="Net Profit"
          value={formatCurrency(summary.netProfit)}
          icon={ProfitIcon}
          color={summary.netProfit >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className={`text-2xl font-bold ${getProfitColor(summary.profitMargin)}`}>
                {formatPercentage(summary.profitMargin)}
              </p>
            </div>
            <PieChart className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalExpenses)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Period</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Date(filters.year, filters.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <InfoCard
        type={summary.netProfit >= 0 ? 'success' : 'warning'}
        title="Profit & Loss Analysis"
        message={`Your business ${summary.netProfit >= 0 ? 'is profitable' : 'is experiencing losses'} for ${new Date(filters.year, filters.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}. ${summary.netProfit >= 0 ? 'Continue monitoring expenses and optimizing sales strategies.' : 'Consider reviewing expenses and pricing strategies to improve profitability.'}`}
        icon={ProfitIcon}
      />

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-yellow-600" />
          Expense Breakdown
        </h3>
        <div className="space-y-4">
          {summary.expenseBreakdown.map((expense, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${expense.color} mr-3`}></div>
                <span className="font-medium text-gray-900">{expense.category}</span>
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <ReuseableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="P&L Filters"
        resultsCount={1}
        totalCount={1}
      />

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-yellow-600" />
            Monthly Breakdown ({filters.year})
          </h3>
        </div>
        <SharedTable
          data={summary.monthlyBreakdown}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No P&L data available"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-yellow-600" />
            Profit Trend
          </h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization will be implemented here</p>
              <p className="text-sm text-gray-400">Monthly profit trend over the year</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-yellow-600" />
            Expense vs Sales
          </h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization will be implemented here</p>
              <p className="text-sm text-gray-400">Expense distribution pie chart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfitLossReports
