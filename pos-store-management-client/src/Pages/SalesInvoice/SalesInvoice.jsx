import React, { useState, useEffect, useCallback } from 'react'
import { FileText, RefreshCw } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import InvoiceList from './components/InvoiceList'
import InvoiceFilter from './components/InvoiceFilter'
import InvoiceViewModal from './components/InvoiceViewModal'
import { invoiceAPI } from './services/invoiceService'
import { applyInvoiceFilters, printInvoice } from './utils/invoiceHelpers'

const SalesInvoice = () => {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  
  const [filters, setFilters] = useState({
    search: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    fetchInvoices()
  }, [])

  const applyFilters = useCallback(() => {
    const filtered = applyInvoiceFilters(invoices, filters)
    setFilteredInvoices(filtered)
  }, [invoices, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const data = await invoiceAPI.getAll()
      setInvoices(data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
      Swal.fire('Error', 'Failed to load invoices', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', paymentStatus: '', dateFrom: '', dateTo: '' })
  }

  const handleView = (invoice) => {
    setSelectedInvoice(invoice)
    setViewModalOpen(true)
  }

  const handlePrint = (invoice) => {
    printInvoice(invoice)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Sales Invoices
            </h1>
            <p className="text-gray-600 mt-2">View, print, and manage sales invoices</p>
          </div>

          <Button variant="secondary" size="md" onClick={fetchInvoices}>
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <InvoiceFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <InvoiceList
        invoices={filteredInvoices}
        onView={handleView}
        onPrint={handlePrint}
        loading={loading}
      />

      <InvoiceViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        invoice={selectedInvoice}
        onPrint={handlePrint}
      />
    </div>
  )
}

export default SalesInvoice