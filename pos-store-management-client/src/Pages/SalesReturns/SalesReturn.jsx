import React, { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Plus, RefreshCw, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import InfoCard from '../../Shared/InfoCard/InfoCard'
import ReturnsList from './components/ReturnsList'
import ReturnFilter from './components/ReturnFilter'
import ReturnModal from './components/ReturnModal'
import { returnsAPI, salesAPI } from './services/returnsService'
import { applyReturnFilters } from './utils/returnsHelpers'

const SalesReturn = () => {
  const [returns, setReturns] = useState([])
  const [invoices, setInvoices] = useState([])
  const [filteredReturns, setFilteredReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const applyFilters = useCallback(() => {
    const filtered = applyReturnFilters(returns, filters)
    setFilteredReturns(filtered)
  }, [returns, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [returnsData, invoicesData] = await Promise.all([
        returnsAPI.getAll(),
        salesAPI.getAll()
      ])
      setReturns(returnsData)
      setInvoices(invoicesData.filter(inv => inv.status !== 'Hold'))
    } catch (error) {
      console.error('Error fetching data:', error)
      Swal.fire('Error', 'Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', dateFrom: '', dateTo: '' })
  }

  const handleCreate = () => {
    setModalOpen(true)
  }

  const handleSave = async (returnData) => {
    try {
      await returnsAPI.create(returnData)
      await Swal.fire('Success!', 'Return created successfully', 'success')
      setModalOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error creating return:', error)
      Swal.fire('Error', 'Failed to create return', 'error')
    }
  }

  const handleApprove = async (returnItem) => {
    const result = await Swal.fire({
      title: 'Approve Return?',
      text: 'Stock will be adjusted automatically',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Yes, approve it!'
    })

    if (result.isConfirmed) {
      try {
        await returnsAPI.approve(returnItem._id)
        await Swal.fire('Approved!', 'Return approved and stock adjusted', 'success')
        fetchData()
      } catch (error) {
        console.error('Error approving return:', error)
        Swal.fire('Error', 'Failed to approve return', 'error')
      }
    }
  }

  const handleReject = async (returnItem) => {
    const result = await Swal.fire({
      title: 'Reject Return?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, reject it!'
    })

    if (result.isConfirmed) {
      try {
        await returnsAPI.reject(returnItem._id)
        await Swal.fire('Rejected!', 'Return has been rejected', 'success')
        fetchData()
      } catch (error) {
        console.error('Error rejecting return:', error)
        Swal.fire('Error', 'Failed to reject return', 'error')
      }
    }
  }

  const handleDelete = async (returnItem) => {
    const result = await Swal.fire({
      title: 'Delete Return?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await returnsAPI.delete(returnItem._id)
        await Swal.fire('Deleted!', 'Return has been deleted', 'success')
        fetchData()
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete return', 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-red-600" />
              Sales Returns
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Manage product returns and stock adjustments</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="secondary" size="sm" onClick={fetchData} className="w-full sm:w-auto flex items-center justify-center">
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Refresh</span>
              </div>
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate} className="w-full sm:w-auto flex items-center justify-center">
              <div className="flex items-center">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">New Return</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <InfoCard
        type="warning"
        title="Sales Returns Management"
        message="Process customer returns, manage refunds, and automatically adjust inventory. Returns must be approved before stock adjustments are made to maintain accurate inventory levels."
        icon={Info}
      />

      <ReturnFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredReturns.length}
        totalCount={returns.length}
      />

      <ReturnsList
        returns={filteredReturns}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        loading={loading}
      />

      <ReturnModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        invoices={invoices}
      />
    </div>
  )
}

export default SalesReturn