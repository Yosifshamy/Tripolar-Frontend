import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  PhotoIcon,
  CalendarIcon,
  MapPinIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import Loading from '@/components/ui/Loading'
import { eventsAPI } from '@/lib/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const AdminEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [imageFiles, setImageFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll()
      if (response.data.success) {
        setEvents(response.data.events)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    reset()
    setImageFiles([])
    setCreateModalOpen(true)
  }

  const openEditModal = (event) => {
    setSelectedEvent(event)
    setValue('title', event.title)
    setValue('description', event.description)
    setValue('date', format(new Date(event.date), 'yyyy-MM-dd'))
    setValue('location', event.location)
    setValue('client', event.client)
    setValue('usherCount', event.usherCount)
    setImageFiles([])
    setEditModalOpen(true)
  }

  const openDeleteModal = (event) => {
    setSelectedEvent(event)
    setDeleteModalOpen(true)
  }

  const closeModals = () => {
    setCreateModalOpen(false)
    setEditModalOpen(false)
    setDeleteModalOpen(false)
    setSelectedEvent(null)
    setImageFiles([])
    reset()
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)
  }

  const handleCreateEvent = async (data) => {
    if (!data.title || !data.description || !data.date || !data.location || !data.client || !data.usherCount) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('date', data.date)
      formData.append('location', data.location)
      formData.append('client', data.client)
      formData.append('usherCount', data.usherCount)

      imageFiles.forEach((file) => {
        formData.append('images', file)
      })

      const response = await eventsAPI.create(formData)
      if (response.data.success) {
        toast.success('Event created successfully')
        fetchEvents()
        closeModals()
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error(error.response?.data?.message || 'Failed to create event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateEvent = async (data) => {
    if (!selectedEvent) return

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('date', data.date)
      formData.append('location', data.location)
      formData.append('client', data.client)
      formData.append('usherCount', data.usherCount)

      imageFiles.forEach((file) => {
        formData.append('images', file)
      })

      const response = await eventsAPI.update(selectedEvent._id, formData)
      if (response.data.success) {
        toast.success('Event updated successfully')
        fetchEvents()
        closeModals()
      }
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error(error.response?.data?.message || 'Failed to update event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      const response = await eventsAPI.delete(selectedEvent._id)
      if (response.data.success) {
        toast.success('Event deleted successfully')
        fetchEvents()
        closeModals()
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error(error.response?.data?.message || 'Failed to delete event')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loading className="text-secondary-white" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light text-secondary-white tracking-wide">MANAGE EVENTS</h1>
            <p className="text-gray-400 mt-2">
              Showcase your successful events and build your portfolio
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-secondary-white text-primary-black hover:bg-secondary-off-white transition-all duration-300 font-medium tracking-wide flex items-center justify-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            ADD EVENT
          </button>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="bg-primary-rich-black border border-gray-700 p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-secondary-white text-lg mb-2">NO EVENTS ADDED YET</p>
            <p className="text-gray-400 mb-6">Start building your event portfolio</p>
            <button
              onClick={openCreateModal}
              className="px-8 py-3 bg-secondary-white text-primary-black hover:bg-secondary-off-white transition-all duration-300 font-medium tracking-wide"
            >
              ADD YOUR FIRST EVENT
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-primary-rich-black border border-gray-700 hover:border-secondary-white transition-all duration-300 h-full flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.images?.[0] || '/api/placeholder/400/250'}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  {event.images && event.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-primary-black/80 text-secondary-white px-3 py-1 text-xs border border-gray-600">
                      +{event.images.length - 1} MORE
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-light text-secondary-white mb-2 line-clamp-2 tracking-wide">
                    {event.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-secondary-white" />
                      {format(new Date(event.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2 text-secondary-white" />
                      {event.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Client</p>
                      <p className="text-sm font-medium text-secondary-white">{event.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Ushers</p>
                      <p className="text-sm font-medium text-secondary-white">{event.usherCount}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => openEditModal(event)}
                      className="p-2 text-gray-400 hover:text-secondary-white hover:bg-primary-dark-gray transition-colors"
                      title="Edit event"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(event)}
                      className="p-2 text-gray-400 hover:text-error-500 hover:bg-error-500/10 transition-colors"
                      title="Delete event"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {(createModalOpen || editModalOpen) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
              onClick={closeModals}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-secondary-white w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-secondary-white border-b border-gray-300 p-6 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-light text-primary-black tracking-wide">
                    {editModalOpen ? 'EDIT EVENT' : 'ADD NEW EVENT'}
                  </h2>
                  <button
                    onClick={closeModals}
                    className="text-gray-600 hover:text-primary-black transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Form */}
                <form
                  onSubmit={handleSubmit(editModalOpen ? handleUpdateEvent : handleCreateEvent)}
                  className="p-6 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2 uppercase tracking-wide">
                        Event Title <span className="text-error-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('title', { required: 'Title is required' })}
                        className="w-full px-4 py-3 bg-primary-black border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-primary-black transition-colors"
                        placeholder="Amazing Corporate Event"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-error-500">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2 uppercase tracking-wide">
                        Client Name <span className="text-error-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('client', { required: 'Client name is required' })}
                        className="w-full px-4 py-3 bg-primary-black border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-primary-black transition-colors"
                        placeholder="ABC Company"
                      />
                      {errors.client && (
                        <p className="mt-1 text-sm text-error-500">{errors.client.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2 uppercase tracking-wide">
                        Event Date <span className="text-error-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register('date', { required: 'Date is required' })}
                        className="w-full px-4 py-3 bg-primary-black border border-gray-600 text-secondary-white focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-primary-black transition-colors"
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-error-500">{errors.date.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2 uppercase tracking-wide">
                        Number of Ushers <span className="text-error-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register('usherCount', { required: 'Number of ushers is required', min: 1 })}
                        className="w-full px-4 py-3 bg-primary-black border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-primary-black transition-colors"
                        placeholder="5"
                        min="1"
                      />
                      {errors.usherCount && (
                        <p className="mt-1 text-sm text-error-500">{errors.usherCount.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-black mb-2 uppercase tracking-wide">
                      Location <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('location', { required: 'Location is required' })}
                      className="w-full px-4 py-3 bg-primary-black border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-primary-black transition-colors"
                      placeholder="Cairo International Convention Center"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-error-500">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-black mb-2 uppercase tracking-wide">
                      Description <span className="text-error-500">*</span>
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={4}
                      className="w-full px-4 py-3 bg-primary-black border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-primary-black transition-colors resize-none"
                      placeholder="Describe the event, its scale, challenges overcome, and success metrics..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-error-500">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-black mb-2 uppercase tracking-wide">
                      Event Images
                    </label>
                    <div className="border-2 border-dashed border-gray-400 bg-primary-black p-8 text-center hover:border-gray-600 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="event-images"
                      />
                      <label htmlFor="event-images" className="cursor-pointer">
                        <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-secondary-white font-medium mb-1 uppercase tracking-wide">
                          CLICK TO UPLOAD OR DRAG AND DROP
                        </p>
                        <p className="text-gray-400 text-sm">
                          PNG, JPG, WebP up to 5MB each
                        </p>
                      </label>
                    </div>
                    {imageFiles.length > 0 && (
                      <p className="mt-2 text-sm text-primary-black">
                        {imageFiles.length} file(s) selected
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-6 py-3 border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors font-medium tracking-wide"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-primary-black text-secondary-white hover:bg-gray-900 transition-colors font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'SAVING...' : editModalOpen ? 'UPDATE EVENT' : 'CREATE EVENT'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModalOpen && selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
              onClick={closeModals}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-secondary-white w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <TrashIcon className="h-6 w-6 text-error-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-primary-black mb-2">
                        DELETE EVENT
                      </h3>
                      <p className="text-gray-700 mb-2">
                        Are you sure you want to delete <strong>{selectedEvent.title}</strong>?
                      </p>
                      <p className="text-sm text-gray-600">
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={closeModals}
                      className="px-4 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={handleDeleteEvent}
                      className="px-4 py-2 bg-error-500 text-secondary-white hover:bg-error-600 transition-colors font-medium"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default AdminEvents