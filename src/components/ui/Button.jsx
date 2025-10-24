import { motion } from 'framer-motion'
import clsx from 'clsx'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  loading = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide'

  const variants = {
    primary: 'bg-secondary-white hover:bg-secondary-off-white text-primary-black shadow-moderate hover:shadow-strong focus:ring-secondary-white focus:ring-offset-primary-black',
    secondary: 'bg-transparent hover:bg-secondary-white text-secondary-white hover:text-primary-black border-2 border-secondary-white focus:ring-secondary-white focus:ring-offset-primary-black',
    outline: 'bg-transparent hover:bg-primary-rich-black text-gray-300 hover:text-secondary-white border-2 border-gray-600 hover:border-secondary-white focus:ring-gray-600 focus:ring-offset-primary-black',
    ghost: 'bg-transparent hover:bg-primary-rich-black text-gray-400 hover:text-secondary-white',
    danger: 'bg-red-600 hover:bg-red-700 text-secondary-white shadow-moderate focus:ring-red-600 focus:ring-offset-primary-black'
  }

  const sizes = {
    sm: 'py-2 px-6 text-sm',
    md: 'py-3 px-8 text-base',
    lg: 'py-4 px-10 text-lg'
  }

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  )

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      style={{ borderRadius: '0px' }} // Sharp edges
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          LOADING...
        </div>
      ) : children}
    </motion.button>
  )
}

export default Button