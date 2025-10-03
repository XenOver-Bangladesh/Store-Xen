import React from 'react'
import { BarChart3, PieChart, Package, TrendingUp, AlertTriangle, Clock, CreditCard, PlusCircle, ShoppingBag, FileText, Calendar, ArrowRight } from 'lucide-react'

export const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hello Admin, here’s your business snapshot today</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of sales, inventory and activities</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-white/70 backdrop-blur px-1 py-1 ring-1 ring-slate-200/70">
              {['Today', 'Week', 'Month'].map((label, i) => (
                <button key={label} className={`px-3 py-1.5 text-sm rounded-full transition ${i === 0 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100/70'}`}>{label}</button>
              ))}
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-slate-900 text-white text-sm shadow-sm hover:shadow md:ml-2">
              <Calendar className="w-4 h-4" />
              Export Snapshot
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Sales Today */}
          <div className="group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Sales Today</p>
                <p className="text-3xl font-bold mt-1">৳35,000</p>
                <p className="text-xs text-emerald-600 mt-1">+12% vs yesterday</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700">
                <TrendingUp />
              </div>
            </div>
          </div>

          {/* Total Stock Items */}
          <div className="group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Total Stock Items</p>
                <p className="text-3xl font-bold mt-1">2,430</p>
                <p className="text-xs text-slate-500 mt-1">SKU count across all categories</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700">
                <Package />
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Low Stock Alerts</p>
                <p className="text-3xl font-bold mt-1 text-red-600">12</p>
                <p className="text-xs text-red-600 mt-1">Reorder recommended</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100 text-red-700">
                <AlertTriangle />
              </div>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Pending Payments</p>
                <p className="text-3xl font-bold mt-1">৳15,000</p>
                <p className="text-xs text-amber-600 mt-1">Due to suppliers</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700">
                <CreditCard />
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Graphs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm xl:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-indigo-600" />
              <h2 className="font-semibold">Sales Trend</h2>
              <div className="ml-auto flex items-center gap-1">
                {['Daily', 'Weekly', 'Monthly'].map((t, i) => (
                  <button key={t} className={`text-xs px-2.5 py-1 rounded-full transition ${i === 0 ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100/70'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="h-64 rounded-xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50/50 to-white flex items-center justify-center text-slate-400 text-sm">
              Chart placeholder
            </div>
          </div>
          <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="text-emerald-600" />
              <h2 className="font-semibold">Stock Distribution</h2>
            </div>
            <div className="h-64 rounded-xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50/50 to-white flex items-center justify-center text-slate-400 text-sm">
              Pie chart placeholder
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-indigo-600" />
            <h2 className="font-semibold">Top Selling Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {['Milk Pack 1L', 'Paracetamol 500mg', 'Rice 5kg', 'Dish Soap'].map((name, index) => (
              <div key={index} className="rounded-xl ring-1 ring-slate-200/70 p-4 hover:shadow-md transition">
                <p className="font-medium">{name}</p>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                  <span>Today</span>
                  <span className="inline-flex items-center gap-1 text-slate-700"><TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> {Math.floor(20 - index * 2)} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-600" />
              <h2 className="font-semibold">Alerts & Notifications</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm rounded-xl p-3 ring-1 ring-red-200/60 bg-red-50/60 text-red-800">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-semibold">Low Stock</p>
                  <p className="text-red-700">Milk Pack (2L) only 5 left</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm rounded-xl p-3 ring-1 ring-amber-200/60 bg-amber-50/60 text-amber-900">
                <Clock className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-semibold">Expiry Alert</p>
                  <p>Paracetamol batch expiring in 12 days</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm rounded-xl p-3 ring-1 ring-amber-200/60 bg-amber-50/60 text-amber-900">
                <CreditCard className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-semibold">Payment Due</p>
                  <p>Supplier XYZ – ৳5,000 Due</p>
                </div>
              </li>
            </ul>
          </div>
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[{ icon: PlusCircle, label: 'Create Purchase Order' }, { icon: Package, label: 'Receive Goods (GRN)' }, { icon: ShoppingBag, label: 'Open POS Terminal' }, { icon: FileText, label: 'Generate Report' }].map(({ icon, label }) => (
                <button key={label} className="group text-left rounded-xl ring-1 ring-slate-200/70 p-4 hover:shadow-md transition">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-100 to-white flex items-center justify-center mb-2">
                    {React.createElement(icon, { className: 'w-5 h-5 text-slate-700' })}
                  </div>
                  <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    {label}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Recent Activities</h2>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
            <ul className="space-y-4">
              {[
                'Invoice #INV-1001 – ৳2,500 – Paid by Cash',
                'PO #PO-2001 sent to Supplier A',
                'GRN #GRN-1501 received – 50 units added to stock',
              ].map((text, i) => (
                <li key={i} className="pl-8 relative">
                  <span className="absolute left-1 top-1.5 w-4 h-4 rounded-full bg-white ring-2 ring-indigo-500" />
                  <div className="rounded-lg ring-1 ring-slate-200/70 p-3 bg-white/70">
                    <p className="text-sm">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
