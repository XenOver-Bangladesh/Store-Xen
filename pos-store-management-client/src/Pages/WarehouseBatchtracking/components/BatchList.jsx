import React from 'react'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import Button from '../../../Components/UI/Button'
import { Calendar, Clock, Pencil } from 'lucide-react'
import { 
  getExpiryStatusColor, 
  getExpiryStatusDisplay,
  getDaysUntilExpiry,
  formatDate 
} from '../utils/batchHelpers'

const BatchList = ({
  inventory = [],
  loading = false,
  onEditBatch
}) => {
  const columns = [
    { 
      header: "Product Name", 
      accessorKey: "productName",
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-900">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "Product ID", 
      accessorKey: "productId",
      cell: ({ getValue }) => (
        <div className="text-gray-700 font-mono text-sm">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "Batch Number", 
      accessorKey: "batch",
      cell: ({ getValue }) => (
        <div className="font-mono text-sm text-blue-600">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "Expiry Date", 
      accessorKey: "expiry",
      cell: ({ getValue }) => (
        <div className="text-gray-700">{formatDate(getValue())}</div>
      )
    },
    { 
      header: "Location", 
      accessorKey: "location",
      cell: ({ getValue }) => (
        <div className="text-gray-700">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "Stock Qty", 
      accessorKey: "stockQty",
      cell: ({ getValue }) => (
        <div className="font-semibold text-gray-900">{getValue() || 0}</div>
      )
    },
    { 
      header: "Status", 
      accessorKey: "expiry",
      cell: ({ getValue }) => {
        const status = getExpiryStatusDisplay(getValue())
        const colorClasses = getExpiryStatusColor(getValue())
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClasses}`}>
            {status}
          </span>
        )
      }
    },
    { 
      header: "Days Until Expiry", 
      accessorKey: "expiry",
      cell: ({ getValue }) => {
        const days = getDaysUntilExpiry(getValue())
        if (days === null) return <span className="text-gray-400 text-sm">N/A</span>
        
        const colorClass = days < 0 ? 'text-red-600' : days <= 30 ? 'text-yellow-600' : 'text-green-600'
        return (
          <div className={`text-sm font-medium ${colorClass}`}>
            {days < 0 ? 'Expired' : `${days} days`}
          </div>
        )
      }
    }
  ]

  const renderRowActions = (item) => (
    <div className="flex items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() => onEditBatch(item)}
        title="Edit Batch Information"
      >
        <div className="flex items-center">
          <Pencil className="w-4 h-4 mr-1" />
          <span>Edit</span>
        </div>
      </Button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SharedTable
        columns={columns}
        data={inventory}
        pageSize={10}
        loading={loading}
        renderRowActions={renderRowActions}
        actionsHeader="Actions"
      />
    </div>
  )
}

export default BatchList
