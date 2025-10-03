import React from 'react'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'

const SuppliersList = () => {
  const columns = [
    { header: 'Supplier Name', accessorKey: 'supplierName' },
    { header: 'Contact Person', accessorKey: 'contactPerson' },
    { header: 'Phone', accessorKey: 'phone' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Status', accessorKey: 'status' },
  ]

  const data = [
    { supplierName: 'ABC Traders', contactPerson: 'Mr. Rahim', phone: '01711-000111', email: 'abc@shop.com', status: 'Active' },
    { supplierName: 'City Wholesale', contactPerson: 'Ms. Rupa', phone: '01822-111222', email: 'city@wholesale.com', status: 'Active' },
    { supplierName: 'Delta Distributors', contactPerson: 'Tanvir', phone: '01633-222333', email: 'delta@distrib.com', status: 'Inactive' },
    { supplierName: 'North Supply Co', contactPerson: 'Imran', phone: '01944-333444', email: 'north@supply.co', status: 'Active' },
  ]

  return (
    <div className='p-4'>
      <div className='rounded-2xl p-5 bg-white shadow-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold'>Suppliers</h1>
            <p className='text-sm text-slate-500'>All supplier records</p>
          </div>
        </div>
        <SharedTable
          columns={columns}
          data={data}
          pageSize={10}
          actionsHeader='Actions'
          renderRowActions={() => (
            <div className='flex items-center gap-2'>
              <button className='px-2.5 py-1.5 rounded-lg border text-xs hover:bg-slate-50'>Edit</button>
              <button className='px-2.5 py-1.5 rounded-lg border text-xs text-red-600 hover:bg-red-50'>Delete</button>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default SuppliersList