import React from 'react'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import Button from '../../../Components/UI/Button'
import { QrCode, Barcode, Pencil } from 'lucide-react'
import { 
  getBarcodeStatusColor, 
  getBarcodeStatusDisplay,
  generateQRCodeURL,
  formatDate 
} from '../utils/barcodeHelpers'

const BarcodeList = ({
  inventory = [],
  loading = false,
  onEditBarcode
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
      header: "SKU", 
      accessorKey: "sku",
      cell: ({ getValue }) => (
        <div className="text-gray-700 font-mono text-sm">{getValue() || 'N/A'}</div>
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
      header: "Barcode", 
      accessorKey: "barcode",
      cell: ({ getValue }) => {
        const barcode = getValue()
        return barcode ? (
          <div className="font-mono text-sm text-blue-600">{barcode}</div>
        ) : (
          <span className="text-gray-400 text-sm">Not assigned</span>
        )
      }
    },
    { 
      header: "QR Code", 
      accessorKey: "qrCode",
      cell: ({ getValue }) => {
        const qrCode = getValue()
        return qrCode ? (
          <div className="font-mono text-sm text-green-600">{qrCode}</div>
        ) : (
          <span className="text-gray-400 text-sm">Not assigned</span>
        )
      }
    },
    { 
      header: "Status", 
      accessorKey: "barcode",
      cell: ({ getValue, row }) => {
        const hasBarcode = getValue() || row.original.qrCode
        const colorClasses = getBarcodeStatusColor(hasBarcode)
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClasses}`}>
            {getBarcodeStatusDisplay(hasBarcode)}
          </span>
        )
      }
    },
    { 
      header: "Last Updated", 
      accessorKey: "updatedAt",
      cell: ({ getValue }) => (
        <div className="text-gray-500 text-sm">{formatDate(getValue())}</div>
      )
    }
  ]

  const renderRowActions = (item) => (
    <div className="flex items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() => onEditBarcode(item)}
        title="Edit Barcode/QR Code"
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

export default BarcodeList
