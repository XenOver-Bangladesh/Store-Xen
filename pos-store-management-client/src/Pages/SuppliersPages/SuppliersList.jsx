import React, { useState, useMemo, useEffect } from "react";
import { SharedTable } from "../../Shared/SharedTable/SharedTable";
import Button from "../../Components/UI/Button";
import { Edit, Trash2 } from "lucide-react";
import { SuppliersFilter } from "./SuppliersFilter";
import EditSuppliersModal from "./EditSuppliersModal";
import axios from "axios";
import Swal from 'sweetalert2';

const SuppliersList = () => {
  const [suppliersData, setSuppliersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    paymentTerms: '',
    search: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Fetch suppliers data from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("https://pos-system-management-server-20.vercel.app/suppliers");
        setSuppliersData(response.data);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch suppliers');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const columns = [
    { 
      header: "Supplier Name", 
      accessorKey: "supplierName",
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-900">{getValue()}</div>
      )
    },
    { 
      header: "Contact Person", 
      accessorKey: "contactPerson",
      cell: ({ getValue }) => (
        <div className="text-gray-700">{getValue()}</div>
      )
    },
    { 
      header: "Phone", 
      accessorKey: "phone",
      cell: ({ getValue }) => (
        <div className="text-gray-600 font-mono text-sm">{getValue()}</div>
      )
    },
    { 
      header: "Email", 
      accessorKey: "email",
      cell: ({ getValue }) => (
        <div className="text-blue-600 hover:text-blue-800">{getValue()}</div>
      )
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        );
      }
    },
  ];

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return suppliersData.filter(supplier => {
      const matchesStatus = !filters.status || supplier.status.toLowerCase() === filters.status.toLowerCase();
      const matchesPaymentTerms = !filters.paymentTerms || supplier.paymentTerms.toLowerCase().includes(filters.paymentTerms.toLowerCase());
      const matchesSearch = !filters.search || 
        supplier.supplierName.toLowerCase().includes(filters.search.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(filters.search.toLowerCase()) ||
        supplier.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        supplier.phone.includes(filters.search);
      
      return matchesStatus && matchesPaymentTerms && matchesSearch;
    });
  }, [filters, suppliersData]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      paymentTerms: '',
      search: ''
    });
  };

  const handleEditSupplier = (supplier) => {
    if (supplier && (supplier._id || supplier.id)) {
      setSelectedSupplier(supplier);
      setIsEditModalOpen(true);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid supplier data. Cannot edit this supplier.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleSupplierUpdated = (updatedSupplier) => {
    console.log('Supplier updated:', updatedSupplier);
    console.log('Current suppliers data before update:', suppliersData);
    
    // Update the supplier in the local state
    setSuppliersData(prev => {
      const updated = prev.map(supplier => {
        const currentId = supplier._id || supplier.id;
        const updatedId = updatedSupplier._id || updatedSupplier.id;
        
        console.log('Comparing IDs:', { currentId, updatedId, match: currentId === updatedId });
        
        if (currentId === updatedId) {
          // Merge the updated data with existing data to preserve all fields
          const merged = { ...supplier, ...updatedSupplier };
          console.log('Merged supplier data:', merged);
          return merged;
        }
        return supplier;
      });
      
      console.log('Updated suppliers data:', updated);
      return updated;
    });
  };

  const handleDeleteSupplier = async (supplier) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${supplier.supplierName}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
      try {
        // Use the correct ID field - try both _id and id
        const supplierId = supplier._id || supplier.id;
        await axios.delete(`https://pos-system-management-server-20.vercel.app/suppliers/${supplierId}`);
        
        // Remove from local state using the same ID field
        setSuppliersData(prev => prev.filter(s => (s._id || s.id) !== supplierId));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Supplier has been deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          timerProgressBar: true
        });
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete supplier',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleExport = () => {
    try {
      // Convert data to CSV format
      const csvContent = [
        ['Supplier Name', 'Contact Person', 'Phone', 'Email', 'Status', 'Payment Terms'],
        ...filteredData.map(supplier => [
          supplier.supplierName,
          supplier.contactPerson,
          supplier.phone,
          supplier.email,
          supplier.status,
          supplier.paymentTerms
        ])
      ].map(row => row.join(',')).join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `suppliers-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      Swal.fire({
        title: 'Success!',
        text: 'Suppliers data exported successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error('Export error:', error);
      Swal.fire({
        title: 'Export Error!',
        text: 'Failed to export suppliers data',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <SuppliersFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onExport={handleExport}
        resultsCount={filteredData.length}
        totalCount={suppliersData.length}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-4">
          <div className="flex items-center justify-center text-center">
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading suppliers
              </h3>
              <div className=" text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    Swal.fire({
                      title: 'Retry?',
                      text: 'Do you want to retry fetching suppliers?',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonText: 'Yes, retry',
                      cancelButtonText: 'Cancel',
                      confirmButtonColor: '#3b82f6',
                      cancelButtonColor: '#6b7280'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        window.location.reload();
                      }
                    });
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Table */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <SharedTable
          columns={columns}
          data={filteredData}
          pageSize={50}
          loading={loading}
          actionsHeader="Actions"
          renderRowActions={(supplier) => (
            <div className="flex items-center gap-2">
              <Button 
                variant="edit" 
                size="sm"
                onClick={() => handleEditSupplier(supplier)}
              >
                <div className="flex items-center">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </div>
              </Button>
              <Button 
                variant="delete" 
                size="sm"
                onClick={() => handleDeleteSupplier(supplier)}
              >
                <div className="flex items-center">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </div>
              </Button>
            </div>
          )}
        />
      </div>

      {/* Edit Supplier Modal */}
      <EditSuppliersModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleSupplierUpdated}
        supplierData={selectedSupplier}
      />
    </div>
  );
};

export default SuppliersList;
