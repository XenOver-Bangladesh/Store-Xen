import React, { useState, useRef } from 'react'
import SharedModal from '../../Shared/SharedModal/SharedModal'
import { AddSuppliersFrom } from './AddSuppliersFrom'
import Button from '../../Components/UI/Button'
import axios from "axios";
import Swal from 'sweetalert2';



const AddSuppliersModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      // Post data to your API
      const response = await axios.post("http://localhost:3000/suppliers", values);
      console.log("Add Supplier response:", response.data);
      
      // Show success message with SweetAlert2
      await Swal.fire({
        title: 'Success!',
        text: 'Supplier added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data)
      }
      
      // Close modal after successful submission
      onClose()
    } catch (error) {
      console.error('Error adding supplier:', error)
      // Show error message with SweetAlert2
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message || 'Failed to add supplier',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      })
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