import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ushersAPI, requestsAPI } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STATIC_URL = API_URL.replace(/\/api$/, "") || "http://localhost:5000";

const ContactPage = () => {
  const [ushers, setUshers] = useState([]);
  const [selectedUshers, setSelectedUshers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchUshers();
  }, []);

  const fetchUshers = async () => {
    try {
      const response = await ushersAPI.getAll();
      if (response.data.success) {
        // Only show visible ushers
        const visibleUshers = response.data.ushers.filter(
          (usher) => usher.isVisibleOnWebsite !== false
        );
        setUshers(visibleUshers.slice(0, 8)); // Show first 8 ushers
      }
    } catch (error) {
      console.error("Error fetching ushers:", error);
      toast.error("Failed to load ushers");
    }
  };

  const toggleUsherSelection = (usherId) => {
    setSelectedUshers((prev) =>
      prev.includes(usherId)
        ? prev.filter((id) => id !== usherId)
        : [...prev, usherId]
    );
  };

  const handleNext = () => {
    if (selectedUshers.length === 0) {
      toast.error("Please select at least one usher");
      return;
    }
    setCurrentStep(2);
  };

  const onSubmit = async (data) => {
    if (selectedUshers.length === 0) {
      toast.error("Please select at least one usher");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        clientName: data.name, // Map 'name' to 'clientName'
        clientEmail: data.email, // Map 'email' to 'clientEmail'
        clientPhone: data.phone || "",
        eventDetails: data.message, // Map 'message' to 'eventDetails'
        eventType: "Event Request", // Add this required field
        selectedUshers: selectedUshers,
        status: "pending",
      };

      console.log("Sending request data:", requestData); // Debug log

      const response = await requestsAPI.create(requestData);
      if (response.data.success) {
        toast.success(
          "Request submitted successfully! We will contact you soon."
        );
        reset();
        setSelectedUshers([]);
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      console.error("Error response:", error.response?.data); // More detailed error
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
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
                REQUEST OUR USHERS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 max-w-3xl mx-auto font-light"
              >
                Select your preferred ushers and submit your event requirements.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-primary-rich-black border border-gray-700 p-8 sticky top-24">
                  <h2 className="text-2xl font-light text-secondary-white mb-8 tracking-wide">
                    CONTACT INFORMATION
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <PhoneIcon className="w-6 h-6 text-secondary-white flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-secondary-white mb-1 uppercase tracking-wide">
                          Phone
                        </h3>
                        <p className="text-gray-400">+20 100 123 4567</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <EnvelopeIcon className="w-6 h-6 text-secondary-white flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-secondary-white mb-1 uppercase tracking-wide">
                          Email
                        </h3>
                        <p className="text-gray-400">
                          info@tripolar-events.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <MapPinIcon className="w-6 h-6 text-secondary-white flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-secondary-white mb-1 uppercase tracking-wide">
                          Address
                        </h3>
                        <p className="text-gray-400">Cairo, Egypt</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-700">
                      <div className="flex items-start space-x-4">
                        <ClockIcon className="w-6 h-6 text-secondary-white flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-sm font-medium text-secondary-white mb-1 uppercase tracking-wide">
                            Quick Response
                          </h3>
                          <p className="text-gray-400 text-sm">
                            We typically respond to requests within 24 hours
                            during business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Request Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Step 1: Select Ushers */}
                  <div className="bg-primary-rich-black border border-gray-700 p-8">
                    <h2 className="text-2xl font-light text-secondary-white mb-6 tracking-wide">
                      STEP 1: SELECT USHERS ({selectedUshers.length} SELECTED)
                    </h2>

                    {ushers.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-400">No ushers available</p>
                        <Link
                          to="/ushers"
                          className="text-secondary-white hover:underline mt-2 inline-block"
                        >
                          Browse all ushers
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {ushers.map((usher) => (
                          <motion.div
                            key={usher._id}
                            onClick={() => toggleUsherSelection(usher._id)}
                            className={`cursor-pointer border-2 transition-all duration-300 ${
                              selectedUshers.includes(usher._id)
                                ? "border-secondary-white bg-primary-rich-black"
                                : "border-gray-700 hover:border-gray-500"
                            }`}
                          >
                            {/* Profile Image */}
                            <div className="aspect-square bg-primary-dark-gray overflow-hidden">
                              <img
                                src={`${STATIC_URL}${usher.profile.profileImage}`}
                                alt={`${usher.name}'s profile`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  console.error(
                                    "Image load failed:",
                                    e.target.src
                                  );
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "block";
                                }}
                              />
                            </div>

                            {/* Usher Name */}
                            <div className="p-4 bg-primary-rich-black">
                              <h3 className="text-lg font-medium text-secondary-white mb-1">
                                {usher.name}
                              </h3>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {usher.profile?.bio ||
                                  "Professional usher with extensive experience in event management."}
                              </p>
                            </div>

                            {/* Checkmark */}
                            {selectedUshers.includes(usher._id) && (
                              <div className="absolute top-4 right-4 w-8 h-8 bg-secondary-white flex items-center justify-center">
                                <CheckIcon className="w-5 h-5 text-primary-black" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <Link
                      to="/ushers"
                      className="text-sm text-gray-400 hover:text-secondary-white transition-colors underline"
                    >
                      View all ushers & advanced options
                    </Link>

                    {currentStep === 1 && (
                      <div className="mt-8">
                        <button
                          type="button"
                          onClick={handleNext}
                          className="w-full py-4 bg-secondary-white text-primary-black hover:bg-secondary-off-white transition-all duration-300 font-medium tracking-widest text-sm disabled:opacity-50"
                          disabled={selectedUshers.length === 0}
                        >
                          NEXT: CONTACT INFORMATION
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Contact Form */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary-rich-black border border-gray-700 p-8"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-light text-secondary-white tracking-wide">
                          STEP 2: YOUR INFORMATION
                        </h2>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-gray-400 hover:text-secondary-white transition-colors text-sm"
                        >
                          ← BACK
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wide">
                              Your Name{" "}
                              <span className="text-error-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...register("name", {
                                required: "Name is required",
                              })}
                              className="w-full px-4 py-3 bg-primary-black border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors"
                              placeholder="Enter your full name"
                            />
                            {errors.name && (
                              <p className="mt-1 text-sm text-error-500">
                                {errors.name.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wide">
                              Email <span className="text-error-500">*</span>
                            </label>
                            <input
                              type="email"
                              {...register("email", {
                                required: "Email is required",
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Invalid email address",
                                },
                              })}
                              className="w-full px-4 py-3 bg-primary-black border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors"
                              placeholder="your@email.com"
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-error-500">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wide">
                            Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            {...register("phone")}
                            className="w-full px-4 py-3 bg-primary-black border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors"
                            placeholder="+20 100 123 4567"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wide">
                            Event Details{" "}
                            <span className="text-error-500">*</span>
                          </label>
                          <textarea
                            {...register("message", {
                              required: "Please describe your event",
                            })}
                            rows={6}
                            className="w-full px-4 py-3 bg-primary-black border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors resize-none"
                            placeholder="Event type, date, location, number of guests, special requirements..."
                          />
                          {errors.message && (
                            <p className="mt-1 text-sm text-error-500">
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        {/* Selected Ushers Summary */}
                        <div className="bg-primary-black border border-gray-700 p-4">
                          <p className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                            Selected Ushers ({selectedUshers.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedUshers.map((usherId) => {
                              const usher = ushers.find(
                                (u) => u._id === usherId
                              );
                              return usher ? (
                                <span
                                  key={usherId}
                                  className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-white/10 border border-gray-600 text-secondary-white text-sm"
                                >
                                  {usher.name}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleUsherSelection(usherId)
                                    }
                                    className="hover:text-error-500 transition-colors"
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>

                        <div className="pt-6">
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-secondary-white text-primary-black hover:bg-secondary-off-white transition-all duration-300 font-medium tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-moderate hover:shadow-strong"
                          >
                            {loading ? "SUBMITTING..." : "SUBMIT REQUEST"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
