import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UsersIcon, 
  CalendarIcon, 
  KeyIcon, 
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import Card from '@/components/ui/Card'
import Loading from '@/components/ui/Loading'
import { adminAPI } from '@/lib/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboard()
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setError('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'TOTAL USHERS',
      value: stats?.totalUshers || 0,
      icon: UsersIcon,
      description: 'Registered ushers'
    },
    {
      title: 'ACTIVE USHERS',
      value: stats?.activeUshers || 0,
      icon: CheckCircleIcon,
      description: 'Currently available'
    },
    {
      title: 'TOTAL EVENTS',
      value: stats?.totalEvents || 0,
      icon: CalendarIcon,
      description: 'Events managed'
    },
    {
      title: 'PENDING REQUESTS',
      value: stats?.pendingRequests || 0,
      icon: ClockIcon,
      description: 'Awaiting review'
    },
    {
      title: 'AVAILABLE CODES',
      value: stats?.availableCodes || 0,
      icon: KeyIcon,
      description: 'Signup codes ready'
    },
    {
      title: 'USED CODES',
      value: stats?.usedCodes || 0,
      icon: ClipboardDocumentListIcon,
      description: 'Codes utilized'
    }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loading size="lg" text="LOADING DASHBOARD..." />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-12 bg-primary-black min-h-screen">
        {/* Welcome Header */}
        <div className="text-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-light text-secondary-white mb-4 tracking-luxury">
              DASHBOARD
            </h1>
            <div className="w-24 h-px bg-secondary-white mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg font-light tracking-wide">
              WELCOME BACK! HERE'S WHAT'S HAPPENING WITH TRIPOLAR EVENTS.
            </p>
          </motion.div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 p-6 text-center">
            <p className="text-red-400 font-light tracking-wide">{error.toUpperCase()}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-8 bg-primary-rich-black border-gray-700 hover:border-secondary-white/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <stat.icon className="w-8 h-8 text-secondary-white group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-right">
                    <div className="text-4xl font-light text-secondary-white mb-2 tracking-wide">
                      {stat.value}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-secondary-white mb-2 tracking-wide">
                    {stat.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-light tracking-wide">
                    {stat.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>        
        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-primary-dark-gray border border-gray-700 p-8"
        >
          <div className="flex items-center justify-center space-x-7">
            <div className="text-center">
              <ChartBarIcon className="w-8 h-8 text-secondary-white mx-auto mb-3" />
              <div className="text-2xl font-light text-secondary-white mb-1">24/7</div>
              <p className="text-gray-400 text-sm font-light tracking-wide">SYSTEM UPTIME</p>
            </div>
            <div className="w-px h-16 bg-gray-600"></div>
            <div className="text-center">
              <CogIcon className="w-8 h-8 text-secondary-white mx-auto mb-3" />
              <div className="text-2xl font-light text-secondary-white mb-1">AUTO</div>
              <p className="text-gray-400 text-sm font-light tracking-wide">BACKUP ENABLED</p>
            </div>
            <div className="w-px h-16 bg-gray-600"></div>
            <div className="text-center">
              <CheckCircleIcon className="w-8 h-8 text-secondary-white mx-auto mb-3" />
              <div className="text-2xl font-light text-secondary-white mb-1">SECURE</div>
              <p className="text-gray-400 text-sm font-light tracking-wide">SSL PROTECTED</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard