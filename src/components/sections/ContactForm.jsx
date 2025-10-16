import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ushersAPI, requestsAPI } from '@/lib/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import toast from 'react-hot-toast'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

const ContactForm = () => {
  const [ushers, setUshers] = useState([])
  const [selectedUshers, setSelectedUshers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showUshers, setShowUshers] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  useEffect(() => {
    fetchUshers()
  }, [])

  const fetchUshers = async () => {
    try {
      const response = await ushersAPI.getAll()
      if (response.data.success) {
        setUshers(response.data.ushers.slice(0, 6)) // Show first 6 ushers
      }
    } catch (error) {
      console.error('Error fetching ushers:', error)
    }
  }

  const toggleUsherSelection = (usherId) => {
    setSelectedUshers(prev =>
      prev.includes(usherId)
        ? prev.filter(id => id !== usherId)
        : [...prev, usherId]
    )
  }

  const onSubmit = async (data) => {
    if (selectedUshers.length === 0) {
      toast.error('Please select at least one usher')
      return
    }

    setLoading(true)
    try {
      const requestData = {
        ...data,
        selectedUshers
      }

      const response = await requestsAPI.create(requestData)
      if (response.data.success) {
        toast.success('Request submitted successfully! We will contact you soon.')
        reset()
        setSelectedUshers([])
        setShowUshers(false)
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error(error.response?.data?.message || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-padding bg-primary-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-tertiary mb-4 text-secondary-white">
              REQUEST OUR USHERS
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Ready to make your event seamless? Select your preferred ushers and let us know your requirements.
            </p>
          </div>

          {/* Form Card - Dark Theme */}
          <Card className="bg-primary-rich-black border border-gray-700 p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Quick Usher Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-secondary-white">
                    SELECT USHERS ({selectedUshers.length} SELECTED)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowUshers(!showUshers)}
                    className="btn-outline text-sm px-4 py-2"
                  >
                    {showUshers ? 'Hide' : 'Show'} Ushers
                  </button>
                </div>

                {showUshers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
                  >
                    {ushers.map(usher => (
                      <div
                        key={usher._id}
                        onClick={() => toggleUsherSelection(usher._id)}
                        className={`p-4 border-2 rounded-md cursor-pointer transition-all duration-300 ${
                          selectedUshers.includes(usher._id)
                            ? 'border-success-500 bg-success-500/10'
                            : 'border-gray-600 hover:border-success-500/50 bg-primary-black'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-secondary-white">{usher.name}</p>
                            {usher.profile?.experience && (
                              <p className="text-sm text-gray-400 mt-1">
                                {usher.profile.experience}
                              </p>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedUshers.includes(usher._id)}
                            onChange={() => toggleUsherSelection(usher._id)}
                            className="w-5 h-5 text-success-500 rounded border-gray-500 focus:ring-success-500 bg-primary-black"
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                <Link
                  to="/ushers"
                  className="text-success-500 hover:text-success-400 text-sm font-medium inline-flex items-center mt-4 transition-colors"
                >
                  View All Ushers & Advanced Options →
                </Link>
              </div>

              {/* Contact Information - Dark Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-white mb-2">
                    YOUR NAME <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Enter your full name"
                    className="input-primary w-full"
                  />
                  {errors.name && (
                    <p className="text-error-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-white mb-2">
                    EMAIL ADDRESS <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    placeholder="your@email.com"
                    className="input-primary w-full"
                  />
                  {errors.email && (
                    <p className="text-error-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Message - Dark Textarea */}
              <div>
                <label className="block text-sm font-medium text-secondary-white mb-2">
                  TELL US ABOUT YOUR EVENT
                </label>
                <textarea
                  {...register('message', { required: 'Please describe your event' })}
                  rows={6}
                  placeholder="Event type, date, location, special requirements..."
                  className="input-primary w-full resize-none"
                />
                {errors.message && (
                  <p className="text-error-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Selected Ushers Display */}
              {selectedUshers.length > 0 && (
                <div className="bg-success-500/10 border border-success-500/30 rounded-md p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircleIcon className="h-5 w-5 text-success-500 mr-2" />
                    <p className="text-sm font-medium text-success-500 uppercase">
                      Selected Ushers:
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedUshers.map(usherId => {
                      const usher = ushers.find(u => u._id === usherId)
                      return usher ? (
                        <span
                          key={usherId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-success-500 text-white font-medium"
                        >
                          {usher.name}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Submit Button - Bold & Visible */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactForm