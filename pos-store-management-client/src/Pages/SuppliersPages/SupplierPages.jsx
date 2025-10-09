import React, { useState } from "react";
import { Plus, Users, Info } from "lucide-react";
import SuppliersList from "./components/SuppliersList";
import Button from "../../Components/UI/Button";
import InfoCard from "../../Shared/InfoCard/InfoCard";
import AddSuppliersModal from "./components/AddSuppliersModal";

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
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              Suppliers Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track your suppliers easily
            </p>
          </div>

          <Button 
            variant="primary" 
            size="md"
            onClick={handleOpenModal}
          >
            <div className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              <span>Add New Supplier</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Supplier Database Management"
        message="Maintain a comprehensive database of your suppliers with contact information, payment terms, and status tracking. Suppliers are linked to purchase orders, GRNs, and payments for complete supply chain visibility."
        icon={Info}
      />

      {/* Suppliers List */}
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
