import React, { useState, useMemo, useEffect } from "react";
import { SharedTable } from "../../Shared/SharedTable/SharedTable";
import Button from "../../Components/UI/Button";
import { Edit, Trash2 } from "lucide-react";
import { SuppliersFilter } from "./SuppliersFilter";
import axios from "axios";

const SuppliersList = () => {
  const [suppliersData, setSuppliersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    paymentTerms: '',
    search: ''
  });

  // Fetch suppliers data from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:3000/suppliers");
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

  const handleExport = () => {
    console.log('Exporting suppliers data...');
    // TODO: Implement export functionality
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
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading suppliers
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.location.reload()}
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
          pageSize={10}
          loading={loading}
          filterPlaceholder="Search suppliers..."
          actionsHeader="Actions"
          renderRowActions={(supplier) => (
            <div className="flex items-center gap-2">
              <Button 
                variant="edit" 
                size="sm"
                onClick={() => console.log('Edit supplier:', supplier.id)}
              >
                <div className="flex items-center">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </div>
              </Button>
              <Button 
                variant="delete" 
                size="sm"
                onClick={() => console.log('Delete supplier:', supplier.id)}
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
    </div>
  );
};

export default SuppliersList;
