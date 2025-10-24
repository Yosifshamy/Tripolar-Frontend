import { createContext, useContext } from 'react'
import toast from 'react-hot-toast'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const showSuccess = (message) => {
    toast.success(message, {
      style: {
        background: '#1a1a1a',
        color: '#ffffff',
        border: '1px solid #d4af37',
      },
      iconTheme: {
        primary: '#d4af37',
        secondary: '#ffffff',
      },
    })
  }

  const showError = (message) => {
    toast.error(message, {
      style: {
        background: '#1a1a1a',
        color: '#ffffff',
        border: '1px solid #ef4444',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#ffffff',
      },
    })
  }

  const showInfo = (message) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#1a1a1a',
        color: '#ffffff',
        border: '1px solid #3b82f6',
      },
    })
  }

  const showLoading = (message) => {
    return toast.loading(message, {
      style: {
        background: '#1a1a1a',
        color: '#ffffff',
        border: '1px solid #d4af37',
      },
    })
  }

  const dismiss = (toastId) => {
    toast.dismiss(toastId)
  }

  const value = {
    showSuccess,
    showError,
    showInfo,
    showLoading,
    dismiss,
    toast, // Direct access to react-hot-toast
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastContext