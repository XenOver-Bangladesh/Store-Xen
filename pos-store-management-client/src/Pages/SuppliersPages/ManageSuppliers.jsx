import React from 'react'
import { AddSuppliers } from './AddSuppliers'
import SuppliersList from './SuppliersList'

const SupplierPages = () => {
  return (
    <div>
      <div className='grid grid-cols-2'>
      <AddSuppliers/>
      <SuppliersList/>
      </div>
    </div>
  )
}

export default SupplierPages