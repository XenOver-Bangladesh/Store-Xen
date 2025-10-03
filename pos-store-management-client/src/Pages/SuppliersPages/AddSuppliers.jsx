import React from 'react'
import InputFrom from '../../Shared/InputFrom/InputFrom'

export const AddSuppliers = () => {
  const fields = [
    { name: 'supplierName', label: 'Supplier Name', type: 'text', placeholder: 'e.g. ABC Traders', validation: { required: 'Supplier name is required' } },
    { name: 'contactPerson', label: 'Contact Person', type: 'text', placeholder: 'e.g. Mr. Rahim', validation: { required: 'Contact person is required' } },
    { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '01XXXXXXXXX', validation: { required: 'Phone number is required' } },
    { name: 'email', label: 'Email Address', type: 'text', placeholder: 'name@example.com', validation: { required: 'Email is required' } },
    { name: 'address', label: 'Address', type: 'textarea', rows: 3, placeholder: 'Street, City, ZIP', validation: { required: 'Address is required' } },
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
    { name: 'notes', label: 'Notes / Extra Info', type: 'textarea', rows: 3, placeholder: 'Any extra information' },
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

  const onSubmit = async (values) => {
    // TODO: integrate with API
    console.log('Add Supplier submit:', values)
  }

  return (
    <div className='p-4'>
      <h1 className='text-xl font-semibold mb-4'>Add Supplier</h1>
      <InputFrom
        fields={fields}
        defaultValues={defaultValues}
        submitLabel='Save'
        columns={2}
        onSubmit={onSubmit}
      />
    </div>
  )
}
