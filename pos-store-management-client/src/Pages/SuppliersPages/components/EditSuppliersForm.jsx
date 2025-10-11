import React, { forwardRef } from 'react'
import InputFrom from '../../../Shared/InputFrom/InputFrom'
import { PAYMENT_TERMS_OPTIONS, STATUS_OPTIONS, SUPPLIER_CATEGORIES } from '../utils/supplierHelpers'

export const EditSuppliersForm = forwardRef(({ 
  onSubmit, 
  hideSubmitButton = false, 
  supplierData = {} 
}, ref) => {
  const fields = [
    { name: 'supplierName', label: 'Supplier Name', type: 'text', placeholder: 'e.g. ABC Traders', validation: { required: 'Supplier name is required' } },
    { name: 'contactPerson', label: 'Contact Person', type: 'text', placeholder: 'e.g. Mr. Rahim', validation: { required: 'Contact person is required' } },
    { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '01XXXXXXXXX', validation: { required: 'Phone number is required' } },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com', validation: { required: 'Email address is required' } },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Street, City, ZIP', validation: { required: 'Address is required' } },
    { name: 'city', label: 'City', type: 'text', placeholder: 'City', validation: { required: 'City is required' } },
    { name: 'state', label: 'State', type: 'text', placeholder: 'State', validation: { required: 'State is required' } },
    { name: 'zipCode', label: 'ZIP Code', type: 'text', placeholder: 'ZIP Code', validation: { required: 'ZIP code is required' } },
    { name: 'country', label: 'Country', type: 'text', placeholder: 'Country', validation: { required: 'Country is required' } },
    {
      name: 'paymentTerms',
      label: 'Payment Terms',
      type: 'select',
      options: PAYMENT_TERMS_OPTIONS.map(term => ({ value: term, label: term })),
      validation: { required: 'Payment terms is required' },
    },
    {
      name: 'categories',
      label: 'Product Categories',
      type: 'select',
      options: SUPPLIER_CATEGORIES.map(category => ({ value: category, label: category })),
      validation: { required: 'At least one category is required' },
    },
    { name: 'notes', label: 'Notes / Extra Info', type: 'textarea', placeholder: 'Any extra information' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: STATUS_OPTIONS.map(status => ({ value: status, label: status })),
      validation: { required: 'Status is required' },
    },
  ]

  // Create default values from supplier data with null safety
  const defaultValues = {
    supplierName: supplierData?.supplierName || '',
    contactPerson: supplierData?.contactPerson || '',
    phone: supplierData?.phone || '',
    email: supplierData?.email || '',
    address: supplierData?.address || '',
    city: supplierData?.city || '',
    state: supplierData?.state || '',
    zipCode: supplierData?.zipCode || '',
    country: supplierData?.country || '',
    paymentTerms: supplierData?.paymentTerms || '',
    categories: supplierData?.categories || '',
    notes: supplierData?.notes || '',
    status: supplierData?.status || 'Active',
  }

  const handleSubmit = async (values) => {
    if (onSubmit) {
      await onSubmit(values)
    } else {
      // TODO: integrate with API
      console.log('Edit Supplier submit:', values)
    }
  }

  // Don't render if supplierData is not available
  if (!supplierData) {
    return (
      <div className='space-y-4'>
        <div className='mb-4'>
          <p className='text-sm text-slate-500'>Loading supplier data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='mb-4'>
        <p className='text-sm text-slate-500'>Update the supplier information below</p>
      </div>
      <InputFrom
        ref={ref}
        fields={fields}
        defaultValues={defaultValues}
        submitLabel={hideSubmitButton ? '' : 'Update Supplier'}
        columns={2}
        onSubmit={handleSubmit}
        hideSubmitButton={hideSubmitButton}
      />
    </div>
  )
})

export default EditSuppliersForm
