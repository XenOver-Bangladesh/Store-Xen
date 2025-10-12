import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Search, Bell, User, Settings, LogOut } from 'lucide-react'
import { Z_INDEX } from '../../constants/zIndex'
import { dashboardAPI } from '../../Pages/HomePage/services/dashboardService'
import { useAuth } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const userMenuRef = useRef(null)

  // Fetch notification count
  useEffect(() => {
    fetchNotificationCount()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const fetchNotificationCount = async () => {
    try {
      setLoading(true)
      const alerts = await dashboardAPI.getAlerts()
      setNotificationCount(alerts.length)
    } catch (error) {
      console.error('Error fetching notification count:', error)
      setNotificationCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = () => {
    navigate('/dashboard/notifications')
  }

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
        navigate('/login')
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out successfully!',
          timer: 1500,
          showConfirmButton: false
        })
      }
    })
  }

  const handleProfileClick = () => {
    setShowUserMenu(false)
    navigate('/profile')
  }

  const handleSettingsClick = () => {
    setShowUserMenu(false)
    navigate('/settings')
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard/overview') return 'Dashboard Overview'
    if (path === '/dashboard/notifications') return 'Notifications'
    if (path === '/profile') return 'Profile'
    if (path === '/settings') return 'Settings'
    if (path.startsWith('/suppliers')) return 'Suppliers Management'
    if (path.startsWith('/products')) return 'Products Management'
    if (path.startsWith('/warehouse')) return 'Warehouse Management'
    if (path.startsWith('/sales')) return 'Sales & POS'
    if (path.startsWith('/inventory')) return 'Inventory & Reports'
    return 'Dashboard'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Page Title */}
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Notifications */}
          <button 
            onClick={handleNotificationClick}
            className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors"
            title="View notifications"
          >
            <Bell className="w-6 h-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
            {loading && (
              <div className="absolute -top-1 -right-1 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-200 transform translate-y-0 opacity-100"
                style={{ zIndex: Z_INDEX.DROPDOWN }}
              >
                <div className="py-1">
                  <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'admin@store-xen.com'}</p>
                    <p className="text-xs text-blue-600 mt-1 font-medium">{user?.role || 'Administrator'}</p>
                  </div>
                  <button 
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button 
                    onClick={handleSettingsClick}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
