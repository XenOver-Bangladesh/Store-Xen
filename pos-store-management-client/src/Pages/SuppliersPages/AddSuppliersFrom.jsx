import React, { forwardRef } from 'react'
import InputFrom from '../../Shared/InputFrom/InputFrom'

export const AddSuppliersFrom = forwardRef(({ onSubmit, hideSubmitButton = false }, ref) => {
  const fields = [
    { name: 'supplierName', label: 'Supplier Name', type: 'text', placeholder: 'e.g. ABC Traders', validation: { required: 'Supplier name is required' } },
    { name: 'contactPerson', label: 'Contact Person', type: 'text', placeholder: 'e.g. Mr. Rahim', validation: { required: 'Contact person is required' } },
    { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '01XXXXXXXXX', validation: { required: 'Phone number is required' } },
    { name: 'email', label: 'Email Address', type: 'text', placeholder: 'name@example.com', validation: { required: 'Email is required' } },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Street, City, ZIP', validation: { required: 'Address is required' } },
    {
      name: 'paymentTerms',
      label: 'Payment Terms',
      type: 'select',
      options: [
        { value: 'cash', label: 'Cash' },
        { value: '7_days', label: '7 Days Credit' },
        { value: '30_days', label: '30 Days Credit' },
        { value: 'custom', label: 'Custom' },
      ],
    },
    { name: 'notes', label: 'Notes / Extra Info', type: 'text', placeholder: 'Any extra information' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      validation: { required: 'Status is required' },
    },
  ]

  const defaultValues = {
    supplierName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    paymentTerms: 'cash',
    notes: '',
    status: 'active',
  }

  const handleSubmit = async (values) => {
    if (onSubmit) {
      await onSubmit(values)
    } else {
      // TODO: integrate with API
      console.log('Add Supplier submit:', values)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='mb-4'>
        <p className='text-sm text-slate-500'>Fill in the supplier information below</p>
      </div>
      <InputFrom
        ref={ref}
        fields={fields}
        defaultValues={defaultValues}
        submitLabel={hideSubmitButton ? '' : 'Save'}
        columns={2}
        onSubmit={handleSubmit}
        hideSubmitButton={hideSubmitButton}
      />
    </div>
  )
})

export default AddSuppliersFrom
