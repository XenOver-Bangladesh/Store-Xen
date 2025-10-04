import React, { useState, useMemo } from "react";
import { SharedTable } from "../../Shared/SharedTable/SharedTable";
import Button from "../../Components/UI/Button";
import { Edit, Trash2 } from "lucide-react";
import { SuppliersFilter } from "./SuppliersFilter";

// Static data - moved outside component to avoid re-creation on every render
const suppliersData = [
  {
    id: 1,
    supplierName: "ABC Traders",
    contactPerson: "Mr. Rahim",
    phone: "01711-000111",
    email: "abc@shop.com",
    status: "Active",
    paymentTerms: "30 Days Credit",
    address: "Dhaka, Bangladesh",
    notes: "Reliable supplier for electronics"
  },
  {
    id: 2,
    supplierName: "City Wholesale",
    contactPerson: "Ms. Rupa",
    phone: "01822-111222",
    email: "city@wholesale.com",
    status: "Active",
    paymentTerms: "Cash",
    address: "Chittagong, Bangladesh",
    notes: "Fast delivery, good quality"
  },
  {
    id: 3,
    supplierName: "Delta Distributors",
    contactPerson: "Tanvir",
    phone: "01633-222333",
    email: "delta@distrib.com",
    status: "Inactive",
    paymentTerms: "7 Days Credit",
    address: "Sylhet, Bangladesh",
    notes: "Temporarily suspended"
  },
  {
    id: 4,
    supplierName: "North Supply Co",
    contactPerson: "Imran",
    phone: "01944-333444",
    email: "north@supply.co",
    status: "Active",
    paymentTerms: "30 Days Credit",
    address: "Rajshahi, Bangladesh",
    notes: "Bulk orders preferred"
  },
  {
    id: 5,
    supplierName: "Tech Solutions Ltd",
    contactPerson: "Sarah Ahmed",
    phone: "01555-444555",
    email: "sarah@techsolutions.com",
    status: "Active",
    paymentTerms: "15 Days Credit",
    address: "Dhaka, Bangladesh",
    notes: "IT equipment specialist"
  },
  {
    id: 6,
    supplierName: "Global Imports",
    contactPerson: "John Smith",
    phone: "01444-555666",
    email: "john@globalimports.com",
    status: "Inactive",
    paymentTerms: "Cash",
    address: "Chittagong, Bangladesh",
    notes: "Under review"
  }
];

const SuppliersList = () => {
  const [filters, setFilters] = useState({
    status: '',
    paymentTerms: '',
    search: ''
  });

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
  }, [filters]);

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

      {/* Suppliers Table */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <SharedTable
          columns={columns}
          data={filteredData}
          pageSize={10}
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
