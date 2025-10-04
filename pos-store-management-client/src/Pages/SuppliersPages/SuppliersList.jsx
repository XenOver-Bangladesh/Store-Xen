import React, { useState, useMemo } from "react";
import { SharedTable } from "../../Shared/SharedTable/SharedTable";
import Button from "../../Components/UI/Button";
import { Edit, Trash2, Filter, Download, RefreshCw } from "lucide-react";

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

  const data = [
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

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return data.filter(supplier => {
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

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
             
            >
             <div className="flex p-2 items-center">
             <RefreshCw className="w-4 h-4 mr-2" />
             Clear Filters
             </div>
            </Button>
            <Button
              variant="secondary"
              size="sm"
            >
              <div className="flex p-2 items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
              </div>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Suppliers
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Search by name, contact, email, or phone..."
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Payment Terms Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Terms
            </label>
            <select
              value={filters.paymentTerms}
              onChange={(e) => handleFilterChange('paymentTerms', e.target.value)}
              className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <option value="">All Payment Terms</option>
              <option value="Cash">Cash</option>
              <option value="7 Days Credit">7 Days Credit</option>
              <option value="15 Days Credit">15 Days Credit</option>
              <option value="30 Days Credit">30 Days Credit</option>
            </select>
          </div>
        </div>

        {/* Filter Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing <span className="font-medium text-gray-900">{filteredData.length}</span> of <span className="font-medium text-gray-900">{data.length}</span> suppliers
          </div>
          {Object.values(filters).some(filter => filter !== '') && (
            <div className="flex items-center gap-2">
              <span className="text-blue-600">Filters applied</span>
              <div className="flex items-center gap-1">
                {filters.status && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Status: {filters.status}
                  </span>
                )}
                {filters.paymentTerms && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Payment: {filters.paymentTerms}
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    Search: "{filters.search}"
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
