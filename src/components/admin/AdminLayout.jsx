import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  KeyIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/Button'
import { useState } from 'react'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'DASHBOARD', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'USHERS', href: '/admin/ushers', icon: UsersIcon },
    { name: 'EVENTS', href: '/admin/events', icon: CalendarIcon },
    { name: 'SIGNUP CODES', href: '/admin/codes', icon: KeyIcon },
    { name: 'REQUESTS', href: '/admin/requests', icon: ClipboardDocumentListIcon },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-primary-black border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center justify-center px-8 py-8 border-b border-gray-800">
        <Link to="/" className="flex items-center">
            <img src="/assets/logo1.png" className="h-10" alt="" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8 space-y-3">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-6 py-4 text-sm font-light transition-all duration-300 border border-transparent hover:border-gray-600 group ${
              isActive(item.href)
                ? 'bg-primary-rich-black border-secondary-white/20 text-secondary-white'
                : 'text-gray-300 hover:text-secondary-white hover:bg-primary-rich-black/50'
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="tracking-wide">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-gray-800 p-6">
        <div className="flex items-center mb-6 pb-4 border-b border-gray-800">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-white tracking-wide">{user?.name?.toUpperCase()}</p>
            <p className="text-xs text-gray-400 tracking-wide">ADMINISTRATOR</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-red-900/20 border border-gray-600 hover:border-red-400/50 transition-all duration-300"
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-3" />
          <span className="tracking-wide">LOGOUT</span>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-primary-black flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-80">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="relative flex-1 flex flex-col max-w-xs w-full"
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 text-gray-300 hover:text-secondary-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <Sidebar />
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-primary-black">
        {/* Top Navigation */}
        <header className="bg-primary-rich-black border-b border-gray-800 px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 text-gray-300 hover:text-secondary-white hover:bg-primary-dark-gray transition-all duration-300 mr-4"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              <h1 className="text-3xl font-light text-secondary-white tracking-wide">
                ADMIN PANEL
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              <Link to="/">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="tracking-wide text-gray-300 border-gray-600 hover:text-secondary-white hover:border-secondary-white"
                >
                  VIEW WEBSITE
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-primary-black">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout