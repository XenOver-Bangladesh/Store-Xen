import React from 'react'
import { AddSuppliers } from './AddSuppliers'
import SuppliersList from './SuppliersList'

const SupplierPages = () => {
  return (
    <div className='p-4'>
      <h1 className='bg-blue-200 p-5 text-center rounded-2xl text-2xl font-semibold'>Suppliers management</h1>
      <p></p>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <AddSuppliers/>
        <SuppliersList/>
      </div>
    </div>
  )
}

export default SupplierPages