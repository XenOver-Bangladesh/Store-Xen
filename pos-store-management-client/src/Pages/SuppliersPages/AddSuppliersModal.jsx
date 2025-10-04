import React, { useState, useRef } from 'react'
import SharedModal from '../../Shared/SharedModal/SharedModal'
import { AddSuppliersFrom } from './AddSuppliersFrom'
import Button from '../../Components/UI/Button'

const AddSuppliersModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      // TODO: integrate with API
      console.log('Add Supplier submit:', values)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(values)
      }
      
      // Close modal after successful submission
      onClose()
    } catch (error) {
      console.error('Error adding supplier:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
  }

  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button
        variant="secondary"
        size="md"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={handleSaveClick}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding Supplier...' : 'Add Supplier'}
      </Button>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Supplier"
      size="large"
      footer={modalFooter}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="max-h-96 overflow-y-auto">
        <AddSuppliersFrom 
          onSubmit={handleFormSubmit} 
          hideSubmitButton={true}
          ref={formRef}
        />
      </div>
    </SharedModal>
  )
}

export default AddSuppliersModal