import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import UshersPage from './pages/UshersPage'
import EventsPage from './pages/EventsPage'
import ContactPage from './pages/ContactPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUshers from './pages/admin/AdminUshers'
import AdminEvents from './pages/admin/AdminEvents'
import AdminCodes from './pages/admin/AdminCodes'
import AdminRequests from './pages/admin/AdminRequests'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-secondary-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/ushers" element={<UshersPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/ushers" element={
              <ProtectedRoute requireAdmin>
                <AdminUshers />
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute requireAdmin>
                <AdminEvents />
              </ProtectedRoute>
            } />
            <Route path="/admin/codes" element={
              <ProtectedRoute requireAdmin>
                <AdminCodes />
              </ProtectedRoute>
            } />
            <Route path="/admin/requests" element={
              <ProtectedRoute requireAdmin>
                <AdminRequests />
              </ProtectedRoute>
            } />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid #d4af37',
              },
              success: {
                iconTheme: {
                  primary: '#d4af37',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App