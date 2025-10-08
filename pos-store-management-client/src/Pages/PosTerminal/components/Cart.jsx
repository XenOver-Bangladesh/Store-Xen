import React from 'react'
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react'
import Button from '../../../Components/UI/Button'

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, totals }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Cart ({cartItems.length})</h3>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cartItems.length > 0 ? (
          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ${item.unitPrice.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    
                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                    
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart className="w-16 h-16 mb-3" />
            <p className="text-sm">Cart is empty</p>
            <p className="text-xs mt-1">Add products to start</p>
          </div>
        )}
      </div>

      {/* Totals Summary */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
            </div>
            
            {totals.totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-green-600">-${totals.totalDiscount.toFixed(2)}</span>
              </div>
            )}
            
            {totals.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${totals.tax.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
              <span>Grand Total:</span>
              <span className="text-blue-600">${totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart

