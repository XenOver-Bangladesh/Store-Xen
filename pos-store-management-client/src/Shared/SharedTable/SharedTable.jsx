import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'


export const SharedTable = ({
  columns = [],
  data = [],
  pageSize = 10,
  loading = false,
  filterPlaceholder = 'Search...',
  renderRowActions,
  actionsHeader = 'Actions',
}) => {
  const [sorting, setSorting] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
     

      {/* Table Container */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id} 
                      colSpan={header.colSpan} 
                      className="text-left font-semibold text-gray-700 px-6 py-4 text-sm uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className="inline-flex items-center gap-2 select-none hover:text-blue-600 transition-colors duration-200 group"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          <div className="flex flex-col">
                            <svg 
                              className={`w-3 h-3 transition-colors duration-200 ${
                                header.column.getIsSorted() === 'asc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                              }`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                            <svg 
                              className={`w-3 h-3 transition-colors duration-200 -mt-1 ${
                                header.column.getIsSorted() === 'desc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                              }`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                            </svg>
                          </div>
                        </button>
                      )}
                    </th>
                  ))}
                  {renderRowActions && (
                    <th className="text-left font-semibold text-gray-700 px-6 py-4 text-sm uppercase tracking-wider">
                      {actionsHeader}
                    </th>
                  )}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="text-gray-500 font-medium">Loading data...</p>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className="bg-white hover:bg-blue-50/30 transition-all duration-200 group border-b border-gray-50 last:border-b-0"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 text-sm text-gray-900 group-hover:text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                    {renderRowActions && (
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center justify-start">
                          {renderRowActions(row.original)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">No data available</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
