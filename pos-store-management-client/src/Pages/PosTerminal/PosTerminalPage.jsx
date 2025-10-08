import React, { useState, useEffect } from 'react'
import { ShoppingCart, Package, RefreshCw } from 'lucide-react'
import Swal from 'sweetalert2'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import PaymentSection from './components/PaymentSection'
import { productsAPI, inventoryAPI, customersAPI, salesAPI } from './services/posService'
import { 
  calculateCartTotals, 
  validateSaleData, 
  prepareSaleData, 
  filterProducts,
  printInvoice 
} from './utils/posHelpers'

const PosTerminalPage = () => {
  const [products, setProducts] = useState([])
  const [inventory, setInventory] = useState([])
  const [customers, setCustomers] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    warehouse: ''
  })

  const [totals, setTotals] = useState({
    subtotal: 0,
    totalDiscount: 0,
    tax: 0,
    grandTotal: 0
  })

  // Fetch initial data
  useEffect(() => {
    fetchData()
  }, [])

  // Refresh inventory data periodically to ensure stock accuracy
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const inventoryData = await inventoryAPI.getAll()
        setInventory(inventoryData)
      } catch (error) {
        console.error('Error refreshing inventory:', error)
      }
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Apply filters
  useEffect(() => {
    const filtered = filterProducts(products, filters.search, filters.category, filters.warehouse)
    setFilteredProducts(filtered)
  }, [products, filters])

  // Calculate totals when cart changes
  useEffect(() => {
    const newTotals = calculateCartTotals(cartItems, [], 0) // Add tax rate if needed
    setTotals(newTotals)
  }, [cartItems])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsData, inventoryData, customersData] = await Promise.all([
        productsAPI.getAll(),
        inventoryAPI.getAll(),
        customersAPI.getAll()
      ])
      
      setProducts(productsData)
      setInventory(inventoryData)
      setCustomers(customersData)
      setFilteredProducts(productsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      Swal.fire('Error', 'Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const refreshInventory = async () => {
    try {
      const inventoryData = await inventoryAPI.getAll()
      console.log('Inventory data received:', inventoryData)
      
      // Debug: Log products with multiple inventory records
      const productCounts = {}
      inventoryData.forEach(item => {
        if (!productCounts[item.productId]) {
          productCounts[item.productId] = []
        }
        productCounts[item.productId].push(item)
      })
      
      Object.keys(productCounts).forEach(productId => {
        if (productCounts[productId].length > 1) {
          console.log(`Product ${productId} has ${productCounts[productId].length} inventory records:`, productCounts[productId])
        }
      })
      
      setInventory(inventoryData)
      Swal.fire('Success', 'Inventory data refreshed', 'success')
    } catch (error) {
      console.error('Error refreshing inventory:', error)
      Swal.fire('Error', 'Failed to refresh inventory', 'error')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAddToCart = (product, price) => {
    // Get current stock from inventory to ensure accuracy (aggregate across all locations)
    const inventoryItems = inventory.filter(item => item.productId === product._id)
    const currentStock = inventoryItems.reduce((sum, item) => sum + (item.stockQty || 0), 0)
    
    if (currentStock <= 0) {
      Swal.fire('Out of Stock', 'This product is not available', 'warning')
      return
    }

    const existingItemIndex = cartItems.findIndex(item => item.productId === product._id)

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      const newCartItems = [...cartItems]
      const currentCartQuantity = newCartItems[existingItemIndex].quantity
      
      if (currentCartQuantity < currentStock) {
        newCartItems[existingItemIndex].quantity += 1
        newCartItems[existingItemIndex].availableStock = currentStock // Update available stock
        setCartItems(newCartItems)
      } else {
        Swal.fire('Stock Limit', `Cannot add more than available stock (${currentStock})`, 'warning')
      }
    } else {
      // Add new item to cart
      setCartItems([
        ...cartItems,
        {
          productId: product._id,
          productName: product.productName,
          unitPrice: price,
          quantity: 1,
          availableStock: currentStock,
          category: product.category
        }
      ])
    }
  }

  const handleUpdateQuantity = (index, newQuantity) => {
    const newCartItems = [...cartItems]
    
    if (newQuantity <= 0) {
      handleRemoveItem(index)
      return
    }

    // Get current stock from inventory for real-time validation (aggregate across all locations)
    const productId = newCartItems[index].productId
    const inventoryItems = inventory.filter(item => item.productId === productId)
    const currentStock = inventoryItems.reduce((sum, item) => sum + (item.stockQty || 0), 0)

    if (newQuantity > currentStock) {
      Swal.fire('Stock Limit', `Cannot exceed available stock (${currentStock})`, 'warning')
      return
    }

    newCartItems[index].quantity = newQuantity
    newCartItems[index].availableStock = currentStock // Update available stock
    setCartItems(newCartItems)
  }

  const handleRemoveItem = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index)
    setCartItems(newCartItems)
  }

  const handleClearCart = () => {
    Swal.fire({
      title: 'Clear Cart?',
      text: 'All items will be removed from cart',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems([])
        setSelectedCustomer(null)
      }
    })
  }

  const handleCreateCustomer = async (customerData) => {
    await customersAPI.create(customerData)
    
    await Swal.fire({
      title: 'Success!',
      text: 'Customer created successfully',
      icon: 'success',
      timer: 1500
    })
    
    // Refresh customers and select the new one
    const customersData = await customersAPI.getAll()
    setCustomers(customersData)
    
    const newCustomer = customersData.find(c => c.name === customerData.name)
    setSelectedCustomer(newCustomer)
  }

  const handleCompleteSale = async (paymentMethod) => {
    // Validate with current inventory data
    const validation = validateSaleData(cartItems, selectedCustomer, paymentMethod, inventory)
    
    if (!validation.isValid) {
      Swal.fire('Validation Error', validation.errors.join('\n'), 'error')
      return
    }

    try {
      // Prepare sale data
      const invoiceNo = `INV-${Date.now()}`
      const saleData = prepareSaleData(cartItems, selectedCustomer, paymentMethod, totals, invoiceNo)

      // Create sale
      await salesAPI.create(saleData)

      await Swal.fire({
        title: 'Sale Completed!',
        text: `Invoice: ${saleData.invoiceNo}`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Print Invoice',
        cancelButtonText: 'Close'
      }).then((result) => {
        if (result.isConfirmed) {
          printInvoice({ ...saleData, createdAt: new Date() })
        }
      })

      // Clear cart
      setCartItems([])
      setSelectedCustomer(null)
      
      // Refresh inventory
      const inventoryData = await inventoryAPI.getAll()
      setInventory(inventoryData)
    } catch (err) {
      console.error('Error completing sale:', err)
      Swal.fire('Error', err.response?.data?.message || 'Failed to complete sale', 'error')
    }
  }

  const handleHoldSale = async () => {
    if (cartItems.length === 0) return

    try {
      const invoiceNo = `HOLD-${Date.now()}`
      const saleData = prepareSaleData(cartItems, selectedCustomer, 'Cash', totals, invoiceNo)
      
      await salesAPI.hold(saleData)
      
      await Swal.fire({
        title: 'Sale Held',
        text: 'Sale has been saved for later',
        icon: 'success',
        timer: 1500
      })

      setCartItems([])
      setSelectedCustomer(null)
    } catch {
      Swal.fire('Error', 'Failed to hold sale', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="w-8 h-8 mr-3 text-blue-600" />
              POS Terminal
            </h1>
            <p className="text-gray-600 mt-2">Complete sales transactions quickly and efficiently</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-3">
              <button
                onClick={refreshInventory}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                title="Refresh Inventory"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Refresh Stock</span>
              </button>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Product List */}
        <div className="lg:col-span-2">
          <ProductList
            products={filteredProducts}
            inventory={inventory}
            onAddToCart={handleAddToCart}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Right: Cart & Payment */}
        <div className="space-y-4">
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            totals={totals}
          />

          <PaymentSection
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            onCreateCustomer={handleCreateCustomer}
            cartItems={cartItems}
            totals={totals}
            onCompleteSale={handleCompleteSale}
            onHoldSale={handleHoldSale}
            onClearCart={handleClearCart}
          />
        </div>
      </div>
    </div>
  )
}

export default PosTerminalPage