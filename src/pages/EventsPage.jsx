import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { eventsAPI } from "@/lib/api";
import Button from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/ui/Loading";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await eventsAPI.getAll();
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (selectedEvent && selectedEvent.images) {
      setCurrentImageIndex((prev) =>
        prev === selectedEvent.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedEvent && selectedEvent.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedEvent.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-black flex items-center justify-center pt-16">
        <Loading className="text-secondary-white" />
      </div>
    );
  }

  return (
    <>
    <Header />
      <main className="min-h-screen bg-primary-black pt-16">
        {/* Hero Section */}
        <section className="bg-primary-black text-secondary-white py-20 border-b border-gray-800">
          <div className="container-custom">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl lg:text-7xl font-light mb-6 tracking-widest"
              >
                OUR PREVIOUS EVENTS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 max-w-3xl mx-auto font-light"
              >
                Explore our portfolio of successful events managed by our
                professional ushers.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-20">
          <div className="container-custom">
            {error ? (
              <div className="text-center">
                <div className="bg-error-500/20 border border-error-500/50 p-6 rounded-lg max-w-md mx-auto mb-6">
                  <p className="text-error-100 mb-4">{error}</p>
                </div>
                <Button
                  onClick={fetchEvents}
                  className="bg-secondary-white text-primary-black hover:bg-secondary-off-white"
                >
                  TRY AGAIN
                </Button>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-primary-rich-black border border-gray-700 p-12 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-light text-secondary-white mb-4 tracking-wide">
                    NO EVENTS TO DISPLAY
                  </h3>
                  <p className="text-gray-400 text-lg mb-6">
                    No events to display at the moment.
                  </p>
                  <p className="text-gray-500 text-sm mb-8">
                    Let our experienced team of professional ushers make your
                    event unforgettable.
                  </p>
                  <Link to="/contact">
                    <button className="px-8 py-3 bg-secondary-white text-primary-black hover:bg-secondary-off-white transition-all duration-300 font-medium tracking-wide">
                      GET STARTED
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div
                      className="bg-primary-rich-black border border-gray-700 hover:border-secondary-white transition-all duration-300 cursor-pointer group h-full flex flex-col"
                      onClick={() => {
                        setSelectedEvent(event);
                        setCurrentImageIndex(0);
                      }}
                    >
                      {/* Event Image */}
                      <div className="relative overflow-hidden aspect-video bg-gray-900">
                        <img
                          src={event.images?.[0] || "/api/placeholder/600/400"}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {event.images && event.images.length > 1 && (
                          <div className="absolute top-3 right-3 bg-primary-black/80 text-secondary-white px-3 py-1 text-sm border border-gray-600">
                            +{event.images.length - 1} MORE
                          </div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-light text-secondary-white mb-3 tracking-wide">
                          {event.title}
                        </h3>

                        <p className="text-gray-400 mb-6 line-clamp-3 flex-1">
                          {event.description}
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm text-gray-400">
                            <CalendarIcon className="w-4 h-4 mr-3 text-secondary-white" />
                            {format(new Date(event.date), "MMMM dd, yyyy")}
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPinIcon className="w-4 h-4 mr-3 text-secondary-white" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <UsersIcon className="w-4 h-4 mr-3 text-secondary-white" />
                            {event.usherCount} Professional Ushers
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                          <div className="text-sm text-gray-400">
                            Client:{" "}
                            <span className="font-medium text-secondary-white">
                              {event.client}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 uppercase tracking-wider hover:text-secondary-white transition-colors">
                            VIEW DETAILS →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-rich-black border-t border-gray-800">
          <div className="container-custom text-center">
            <h2 className="text-4xl lg:text-5xl font-light text-secondary-white mb-6 tracking-wider">
              READY TO PLAN YOUR NEXT EVENT?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
              Let our experienced team of professional ushers make your event
              unforgettable.
            </p>
            <Link to="/contact">
              <button className="px-12 py-4 bg-secondary-white text-primary-black hover:bg-secondary-off-white transition-all duration-300 font-medium tracking-widest text-sm shadow-moderate hover:shadow-strong">
                GET STARTED
              </button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-primary-black border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-primary-black border-b border-gray-700 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-light text-secondary-white tracking-wide">
                  {selectedEvent.title}
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-secondary-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Image Gallery */}
              {selectedEvent.images && selectedEvent.images.length > 0 && (
                <div className="relative bg-gray-900">
                  <img
                    src={selectedEvent.images[currentImageIndex]}
                    alt={`${selectedEvent.title} - Image ${
                      currentImageIndex + 1
                    }`}
                    className="w-full h-96 object-cover"
                  />

                  {selectedEvent.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary-black/80 hover:bg-primary-black text-secondary-white p-2 border border-gray-600 hover:border-secondary-white transition-all"
                      >
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary-black/80 hover:bg-primary-black text-secondary-white p-2 border border-gray-600 hover:border-secondary-white transition-all"
                      >
                        <ChevronRightIcon className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary-black/80 px-3 py-1 border border-gray-600 text-secondary-white text-sm">
                        {currentImageIndex + 1} / {selectedEvent.images.length}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Event Details */}
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <CalendarIcon className="w-5 h-5 text-secondary-white" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Date
                      </p>
                      <p className="text-secondary-white">
                        {format(new Date(selectedEvent.date), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <MapPinIcon className="w-5 h-5 text-secondary-white" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Location
                      </p>
                      <p className="text-secondary-white">
                        {selectedEvent.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <UsersIcon className="w-5 h-5 text-secondary-white" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Ushers
                      </p>
                      <p className="text-secondary-white">
                        {selectedEvent.usherCount} Professionals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <div className="w-5 h-5 flex items-center justify-center text-secondary-white text-lg">
                      ★
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Client
                      </p>
                      <p className="text-secondary-white">
                        {selectedEvent.client}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-medium text-secondary-white mb-3 uppercase tracking-wider">
                    Description
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EventsPage;
