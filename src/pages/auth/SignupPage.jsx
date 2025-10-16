import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/context/AuthContext'
import { codesAPI } from '@/lib/api'
import Card from '@/components/ui/Card'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [codeValidation, setCodeValidation] = useState({
    isValid: null,
    message: ''
  })
  const [isValidatingCode, setIsValidatingCode] = useState(false)

  const { register: registerUser, loading } = useAuth()
  const navigate = useNavigate()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm()

  const password = watch('password')

  const validateSignupCode = async (code) => {
    if (!code || code.length < 6) {
      setCodeValidation({ isValid: null, message: '' })
      return
    }

    setIsValidatingCode(true)
    try {
      const response = await codesAPI.verify(code)
      if (response.data.success && response.data.isValid) {
        setCodeValidation({
          isValid: true,
          message: 'CODE IS VALID'
        })
      } else {
        setCodeValidation({
          isValid: false,
          message: 'INVALID OR EXPIRED CODE'
        })
      }
    } catch (error) {
      setCodeValidation({
        isValid: false,
        message: error.response?.data?.message?.toUpperCase() || 'CODE VERIFICATION FAILED'
      })
    } finally {
      setIsValidatingCode(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }

      setProfileImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    setImagePreview(null)
  }

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return
    }

    // Create FormData to send image with other data
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('signupCode', data.signupCode)
    
    if (profileImage) {
      formData.append('profileImage', profileImage)
    }

    const result = await registerUser(formData)
    if (result.success) {
      navigate('/auth/login')
    }
  }

  return (
    <div className="min-h-screen bg-primary-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="text-5xl font-display font-light text-secondary-white tracking-luxury"
          >
            BIPOLAR
          </motion.div>
        </Link>
        <div className="w-24 h-px bg-secondary-white mx-auto my-8"></div>
        <h2 className="text-center text-3xl font-light text-secondary-white tracking-wide">
          JOIN AS A PROFESSIONAL USHER
        </h2>
        <p className="mt-4 text-center text-sm text-gray-400 font-light tracking-wide">
          ALREADY HAVE AN ACCOUNT?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-secondary-white hover:text-gray-300 transition-colors tracking-wide"
          >
            SIGN IN HERE
          </Link>
        </p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-10 px-6 shadow-strong sm:px-12 bg-primary-rich-black border border-gray-700">
          {/* Note Box */}
          <div className="mb-8 p-4 bg-primary-dark-gray border border-gray-600">
            <p className="text-sm text-gray-400 leading-relaxed">
              <span className="font-medium text-secondary-white">NOTE:</span> YOU NEED A SPECIAL SIGNUP CODE FROM OUR ADMIN TO CREATE AN ACCOUNT. EACH CODE CAN ONLY BE USED ONCE.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wider">
                PROFILE PICTURE
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-600 bg-primary-dark-gray p-6 text-center hover:border-gray-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-image"
                  />
                  <label htmlFor="profile-image" className="cursor-pointer">
                    <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-secondary-white font-medium mb-1 uppercase tracking-wide text-sm">
                      CLICK TO UPLOAD
                    </p>
                    <p className="text-gray-400 text-xs">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-48 object-cover border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-error-500 hover:bg-error-600 text-white transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Signup Code */}
            <div>
              <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wider">
                SIGNUP CODE <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ENTER YOUR SIGNUP CODE"
                  {...registerField('signupCode', {
                    required: 'Signup code is required',
                    minLength: {
                      value: 6,
                      message: 'Code must be at least 6 characters'
                    },
                    onChange: (e) => {
                      const value = e.target.value.toUpperCase()
                      setValue('signupCode', value)
                      if (value.length >= 6) {
                        validateSignupCode(value)
                      }
                    }
                  })}
                  className="w-full px-4 py-3 bg-primary-dark-gray border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors uppercase pr-12"
                />
                {isValidatingCode && (
                  <div className="absolute right-3 top-3">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-secondary-white rounded-full animate-spin"></div>
                  </div>
                )}
                {!isValidatingCode && codeValidation.isValid === true && (
                  <CheckCircleIcon className="absolute right-3 top-3 h-6 w-6 text-success-500" />
                )}
                {!isValidatingCode && codeValidation.isValid === false && (
                  <XCircleIcon className="absolute right-3 top-3 h-6 w-6 text-error-500" />
                )}
              </div>
              {errors.signupCode && (
                <p className="mt-1 text-sm text-error-500">{errors.signupCode.message}</p>
              )}
              {codeValidation.message && (
                <p className={`mt-1 text-sm ${codeValidation.isValid ? 'text-success-500' : 'text-error-500'}`}>
                  {codeValidation.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wider">
                FULL NAME <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...registerField('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                className="w-full px-4 py-3 bg-primary-dark-gray border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wider">
                EMAIL ADDRESS <span className="text-error-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...registerField('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-4 py-3 bg-primary-dark-gray border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wider">
                PASSWORD <span className="text-error-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                {...registerField('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="w-full px-4 py-3 bg-primary-dark-gray border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-gray-400 hover:text-secondary-white transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-error-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wider">
                CONFIRM PASSWORD <span className="text-error-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...registerField('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className="w-full px-4 py-3 bg-primary-dark-gray border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[42px] text-gray-400 hover:text-secondary-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || codeValidation.isValid !== true}
              className="w-full py-4 bg-secondary-white text-primary-black hover:bg-secondary-off-white transition-all duration-300 font-medium tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-moderate hover:shadow-strong"
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-secondary-white transition-colors tracking-wide flex items-center justify-center"
              >
                ← BACK TO HOMEPAGE
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default SignupPage