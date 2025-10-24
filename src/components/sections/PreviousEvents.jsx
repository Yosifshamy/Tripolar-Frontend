import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarIcon, MapPinIcon, UsersIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { eventsAPI } from '@/lib/api'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Loading from '@/components/ui/Loading'
import { format } from 'date-fns'

const PreviousEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll()
      if (response.data.success) {
        setEvents(response.data.events.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create a default image as data URL (base64 encoded black rectangle)
  const defaultEventImage = "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='600' height='400' fill='%23000000'/%3E%3Ctext x='300' y='200' text-anchor='middle' fill='%23ffffff' font-size='24' font-family='Arial'%3EEVENT IMAGE%3C/text%3E%3C/svg%3E"

  if (loading) {
    return (
      <section className="section-padding bg-primary-black">
        <div className="container-custom">
          <div className="flex items-center justify-center h-64">
            <Loading size="lg" text="LOADING EVENTS..." />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-primary-black">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary text-secondary-white mb-8">
              <span className="text-luxury">PREVIOUS EVENTS</span>
            </h2>

            <div className="w-24 h-px bg-secondary-white mx-auto mb-8"></div>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              Explore our portfolio of successful events managed by our professional ushers.
            </p>
          </motion.div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg font-light tracking-wide">
              NO EVENTS TO SHOWCASE AT THE MOMENT
            </p>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
              {events.map((event, index) => (
                <motion.div
                  key={event._id || event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden h-full bg-primary-rich-black border-gray-700 hover:border-secondary-white/30 transition-all duration-500 group">
                    <div className="aspect-w-16 aspect-h-10 relative">
                      <img
                        src={event.images?.[0] || defaultEventImage}
                        alt={event.title}
                        className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        onError={(e) => {
                          e.target.src = defaultEventImage
                        }}
                      />
                      {event.images && event.images.length > 1 && (
                        <div className="absolute top-4 right-4 bg-primary-black/80 text-secondary-white px-3 py-1 text-xs tracking-wide">
                          +{event.images.length - 1} MORE
                        </div>
                      )}
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-light text-secondary-white mb-4 tracking-wide">
                        {event.title.toUpperCase()}
                      </h3>

                      <p className="text-gray-300 mb-6 line-clamp-3 font-light leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-3 mb-6 text-sm text-gray-400">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-3 text-secondary-white" />
                          <span className="font-light tracking-wide">
                            {format(new Date(event.date), 'MMMM dd, yyyy').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-3 text-secondary-white" />
                          <span className="font-light tracking-wide">{event.location.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="w-4 h-4 mr-3 text-secondary-white" />
                          <span className="font-light tracking-wide">{event.usherCount} PROFESSIONAL USHERS</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                        <div>
                          <p className="text-xs text-gray-500 font-light tracking-wide">CLIENT</p>
                          <p className="text-sm font-medium text-secondary-white tracking-wide">{event.client.toUpperCase()}</p>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-secondary-white transition-colors duration-300" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-lg text-gray-300 mb-8 font-light tracking-wide">
                READY TO PLAN YOUR NEXT SUCCESSFUL EVENT?
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/events">
                  <Button 
                    variant="secondary" 
                    className="min-w-[200px] text-secondary-white border-secondary-white hover:bg-secondary-white hover:text-primary-black"
                  >
                    VIEW ALL EVENTS
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="min-w-[200px] bg-secondary-white text-primary-black hover:bg-secondary-off-white">
                    START YOUR EVENT
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}

export default PreviousEvents