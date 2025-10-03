import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

/**
 * Reusable data table built on @tanstack/react-table
 * Props:
 * - columns: tanstack column definitions
 * - data: array of rows
 * - pageSize?: number (default 10)
 * - loading?: boolean
 * - filterPlaceholder?: string
 */
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <input
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-full sm:w-72 rounded-xl border border-slate-300 hover:border-slate-400 transition px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={filterPlaceholder}
        />
        <select
          className="rounded-xl border border-slate-300 px-2.5 py-2.5 text-sm hover:border-slate-400 transition"
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size} / page</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50/80">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan} className="text-left font-semibold text-slate-700 px-3.5 py-3 ">
                    {header.isPlaceholder ? null : (
                      <button
                        className="inline-flex items-center gap-1 select-none hover:text-indigo-700"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: '▲', desc: '▼' }[header.column.getIsSorted()] ?? ''}
                      </button>
                    )}
                  </th>
                ))}
                {renderRowActions && (
                  <th className="text-left font-semibold text-slate-700 px-3.5 py-3 ">
                    {actionsHeader}
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center py-10 text-slate-500">Loading...</td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="odd:bg-white even:bg-slate-50/60 hover:bg-indigo-50/40 transition">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-3.5 py-3 ">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  {renderRowActions && (
                    <td className="px-3.5 py-3 ">
                      {renderRowActions(row.original)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center py-10 text-slate-500">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-slate-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border px-2.5 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <button
            className="rounded-lg border px-2.5 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
