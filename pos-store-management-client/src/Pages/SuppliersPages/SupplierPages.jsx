import React, { useState } from "react";
// import { AddSuppliers } from './AddSuppliers'
import SuppliersList from "./SuppliersList";
import Button from "../../Components/UI/Button";
import AddSuppliersModal from "./AddSuppliersModal";

const SupplierPages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSupplierAdded = (supplierData) => {
    console.log('New supplier added:', supplierData);
    // Trigger refresh of the suppliers list
    setRefreshKey(prev => prev + 1);
    
    // Show success message
    alert('Supplier added successfully!');
  };

  return (
    <div className="p-4">
      <div className="bg-blue-50 p-5 rounded-sm shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-black">
            Suppliers Management
          </h1>
          <p className="text-gray-900">
            Manage and track your suppliers easily.
          </p>
        </div>

        <div>
          <Button 
            variant="primary" 
            size="md"
            onClick={handleOpenModal}
          >
            Add New Supplier
          </Button>
        </div>
      </div>

      {/* <AddSuppliers/> */}
      <SuppliersList key={refreshKey} />
      
      {/* AddSuppliersModal */}
      <AddSuppliersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSupplierAdded}
      />
    </div>
  );
};

export default SupplierPages;
