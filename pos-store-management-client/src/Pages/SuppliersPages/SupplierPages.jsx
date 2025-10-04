import React, { useState } from "react";
// import { AddSuppliers } from './AddSuppliers'
import SuppliersList from "./SuppliersList";
import Button from "../../Components/UI/Button";
import AddSuppliersModal from "./AddSuppliersModal";

const SupplierPages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSupplierAdded = (supplierData) => {
    console.log('New supplier added:', supplierData);
    // TODO: Refresh the suppliers list or update state
    // You can add logic here to refresh the SuppliersList component
  };

  return (
    <div className="p-4">
      <div className="bg-blue-100 p-6 rounded-xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Suppliers Management
          </h1>
          <p className="text-gray-600">
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
      <SuppliersList />
      
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
