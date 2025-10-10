import React from 'react'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { getStatusColor, formatDateTime } from '../utils/returnsHelpers'

const ReturnsList = ({ returns, onApprove, onReject, onDelete, loading }) => {
  const columns = [
    {
      accessorKey: 'returnId',
      header: 'Return ID',
      cell: ({ row }) => (
        <span className="font-semibold text-blue-600">{row.original.returnId}</span>
      )
    },
    {
      accessorKey: 'invoiceNo',
      header: 'Invoice No',
      cell: ({ row }) => row.original.invoiceNo
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => row.original.customerName
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.original.reason}</span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatDateTime(row.original.createdAt)
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </span>
      )
    }
  ]

  const renderRowActions = (returnItem) => (
    <div className="flex items-center gap-2">
      {returnItem.status === 'Pending' && (
        <>
          <Button variant="primary" size="sm" onClick={() => onApprove(returnItem)}>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </div>
          </Button>
          <Button variant="delete" size="sm" onClick={() => onReject(returnItem)}>
            <div className="flex items-center">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </div>
          </Button>
        </>
      )}
      {returnItem.status !== 'Approved' && (
        <Button variant="delete" size="sm" onClick={() => onDelete(returnItem)}>
          <div className="flex items-center">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </div>
        </Button>
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SharedTable columns={columns} data={returns} loading={loading} renderRowActions={renderRowActions} pageSize={10} />
    </div>
  )
}

export default ReturnsList

