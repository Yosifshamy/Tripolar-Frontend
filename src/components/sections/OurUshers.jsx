import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ushersAPI } from "@/lib/api";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";

const OurUshers = () => {
  const [ushers, setUshers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchUshers();
  }, []);

  const fetchUshers = async () => {
    try {
      const response = await ushersAPI.getAll();
      if (response.data.success) {
        setUshers(response.data.ushers.slice(0, 6));
      }
    } catch (error) {
      console.error("Error fetching ushers:", error);
    } finally {
      setLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const STATIC_URL = API_URL.replace(/\/api$/, "") || "http://localhost:5000";

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(ushers.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(ushers.length / 3)) % Math.ceil(ushers.length / 3)
    );
  };

  if (loading) {
    return (
      <section className="section-padding bg-primary-rich-black">
        <div className="container-custom">
          <div className="flex items-center justify-center h-64">
            <Loading size="lg" text="LOADING USHERS..." />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-primary-rich-black">
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
              <span className="text-luxury">OUR PROFESSIONAL USHERS</span>
            </h2>

            <div className="w-24 h-px bg-secondary-white mx-auto mb-8"></div>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              Meet our team of trusted, verified professionals ready to make
              your event seamless.
            </p>
          </motion.div>
        </div>

        {ushers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg font-light tracking-wide mb-8">
              NO USHERS AVAILABLE AT THE MOMENT
            </p>
            <Link to="/auth/signup">
              <Button className="bg-secondary-white text-primary-black hover:bg-secondary-off-white">
                BECOME AN USHER
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Ushers Grid */}
            <div className="relative mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {ushers
                  .slice(currentSlide * 3, (currentSlide + 1) * 3)
                  .map((usher, index) => (
                    <motion.div
                      key={usher._id || usher.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <div className="bg-primary-black border border-gray-700 hover:border-secondary-white/30 p-8 transition-all duration-500 group-hover:scale-105">
                        <div className="aspect-w-4 aspect-h-5 mb-6">
                          <img
                            src={`${STATIC_URL}${usher.profile.profileImage}`}
                            alt={usher.name}
                            className="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            onError={(e) => {
                              console.error("Image load failed:", e.target.src);
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "block";
                            }}
                          />
                        </div>

                        <div className="text-center">
                          <h3 className="text-2xl font-light text-secondary-white mb-3 tracking-wide">
                            {usher.name.toUpperCase()}
                          </h3>

                          {usher.profile?.experience && (
                            <p className="text-sm text-gray-300 font-light mb-4 tracking-wide">
                              {usher.profile.experience.toUpperCase()}
                            </p>
                          )}

                          <p className="text-gray-400 mb-6 line-clamp-3 font-light leading-relaxed">
                            {usher.profile?.bio ||
                              "Professional usher with extensive experience in event management."}
                          </p>

                          {usher.profile?.skills &&
                            usher.profile.skills.length > 0 && (
                              <div className="flex flex-wrap justify-center gap-3 mb-6">
                                {usher.profile.skills
                                  .slice(0, 3)
                                  .map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="px-4 py-2 border border-gray-600 text-secondary-white text-xs font-light tracking-wider"
                                    >
                                      {skill.toUpperCase()}
                                    </span>
                                  ))}
                              </div>
                            )}

                          <div className="flex items-center justify-center">
                            <div
                              className={`w-3 h-3 mr-3 ${
                                usher.profile?.availability
                                  ? "bg-green-400"
                                  : "bg-gray-500"
                              }`}
                            ></div>
                            <span className="text-sm text-gray-300 font-light tracking-wide">
                              {usher.profile?.availability
                                ? "AVAILABLE"
                                : "BUSY"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* Navigation Arrows */}
              {ushers.length > 3 && (
                <div className="flex justify-center space-x-6 mt-12">
                  <button
                    onClick={prevSlide}
                    className="p-3 border border-gray-600 hover:border-secondary-white text-gray-300 hover:text-secondary-white transition-all duration-300"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-3 border border-gray-600 hover:border-secondary-white text-gray-300 hover:text-secondary-white transition-all duration-300"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </div>
              )}
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
                READY TO WORK WITH OUR PROFESSIONAL TEAM?
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/ushers">
                  <Button
                    variant="secondary"
                    className="min-w-[200px] text-secondary-white border-secondary-white hover:bg-secondary-white hover:text-primary-black"
                  >
                    VIEW ALL USHERS
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="min-w-[200px] bg-secondary-white text-primary-black hover:bg-secondary-off-white">
                    REQUEST USHERS
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default OurUshers;
